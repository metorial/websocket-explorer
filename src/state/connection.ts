import { create } from 'zustand';
import { generateId, IdPrefix } from '../lib/generateId';
import { useBinStore } from './store';
import { IMessage, MessageType } from './types';

export let connectionState = create<{
  activeConnectionIds: string[];
  setConnectionActive: (connectionId: string, active: boolean) => void;
}>(set => ({
  activeConnectionIds: [],

  setConnectionActive: (connectionId, active) =>
    set(state => {
      let activeConnectionIds = [...state.activeConnectionIds];

      if (active) {
        if (!activeConnectionIds.includes(connectionId)) {
          activeConnectionIds.push(connectionId);
        }
      } else {
        activeConnectionIds = activeConnectionIds.filter(id => id != connectionId);
      }

      return { activeConnectionIds };
    })
}));

let websocketConnections = new Map<
  string,
  {
    send: (data: string) => void;
    websocket: WebSocket;
  }
>();

export let closeConnection = (connectionId: string) => {
  let connection = websocketConnections.get(connectionId);
  if (connection) connection.websocket.close();
};

export let useConnections = () => {
  let { activeConnectionIds, setConnectionActive } = connectionState();

  let connect = (connectionId: string, url: string) => {
    if (websocketConnections.has(connectionId)) return;

    let state = useBinStore.getState();

    let binId = state.bins.find(bin => bin.connections.some(c => c.id == connectionId))?.id;
    let connection = state.bins
      .find(bin => bin.id == binId)
      ?.connections.find(c => c.id == connectionId);

    setConnectionActive(connectionId, true);

    let addMessage = (type: MessageType, payload: string) => {
      useBinStore.setState(s => ({
        messages: {
          ...s.messages,
          [connectionId]: [
            {
              id: generateId(IdPrefix.message),
              type,
              payload,
              createdAt: new Date()
            } as IMessage,
            ...(s.messages[connectionId] ?? [])
          ].slice(0, 500)
        }
      }));
    };

    try {
      let websocket = new WebSocket(url);
      websocketConnections.set(connectionId, {
        websocket,
        send: data => {
          websocket.send(data);
          addMessage(MessageType.sent, data);
        }
      });

      websocket.onopen = () => {
        addMessage(MessageType.open, 'Connection opened');
      };

      websocket.onclose = () => {
        setConnectionActive(connectionId, false);
        addMessage(MessageType.close, 'Connection closed');
        websocketConnections.delete(connectionId);
      };

      websocket.onmessage = event => {
        addMessage(MessageType.received, event.data);
      };

      websocket.onerror = () => {
        addMessage(MessageType.error, 'Connection error');
        setConnectionActive(connectionId, false);
        websocketConnections.delete(connectionId);
      };

      if (connection?.ping?.interval) {
        setInterval(() => {
          if (websocket.readyState == 1 && connection?.ping) {
            websocket.send(connection.ping.message);
            addMessage(MessageType.sent, connection.ping.message);
          }
        }, connection.ping.interval * 1000);
      }
    } catch (e: any) {
      addMessage(MessageType.error, `Failed to connect - ${e.message}`);
    }
  };

  return {
    activeConnectionIds,
    connect,

    send: (connectionId: string, data: string) => {
      let connection = websocketConnections.get(connectionId);
      if (connection && connection.websocket.readyState == 1) {
        connection.send(data);
      }
    },

    disconnect: (connectionId: string) => {
      let connection = websocketConnections.get(connectionId);
      if (connection) {
        connection.websocket.close();
        websocketConnections.delete(connectionId);
        setConnectionActive(connectionId, false);
      }
    }
  };
};
