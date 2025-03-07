import superjson from 'superjson';
import { create } from 'zustand';
import { generateId, IdPrefix } from '../lib/generateId';
import { closeConnection } from './connection';
import { IBin, IConnection, IMessage, MessageType } from './types';

export let useBinStore = create<{
  bins: IBin[];
  currentBinId?: string;
  currentConnectionIds: string[];
  messages: { [connectionId: string]: IMessage[] };

  addBin: (
    bin: Omit<IBin, 'id' | 'savedCommands' | 'connections'> & {
      connections?: Omit<IConnection, 'id'>[];
      messages?: Omit<IMessage, 'id' | 'createdAt'>[];
    }
  ) => void;
  addConnection: (binId: string) => void;
  toggleConnection: (connectionId: string) => void;
  updateConnection: (connectionId: string, updates: Partial<IConnection>) => void;
  setBin: (binId: string) => void;
  updateBin: (binId: string, updates: Partial<IBin>) => void;
  deleteConnection: (connectionId: string) => void;
  clearMessages: (connectionId: string) => void;
}>(set => ({
  currentBinId: undefined,
  currentConnectionIds: [],
  bins: [],
  messages: {},

  addBin: bin =>
    set(state => {
      let newBin: IBin = {
        id: generateId(IdPrefix.bin),
        name: bin.name,
        savedCommands: [],
        connections: bin.connections?.map(c => ({
          ...c,
          id: generateId(IdPrefix.connection)
        })) || [
          {
            id: generateId(IdPrefix.connection),
            name: 'Connection 1',
            url: 'wss://echo.metorial.com'
          }
        ]
      };

      let messages = state.messages;

      if (bin.messages) {
        messages[newBin.connections[0].id] = bin.messages.map(m => ({
          id: generateId(IdPrefix.message),
          ...m,
          createdAt: new Date()
        }));
      }

      return {
        bins: [...state.bins, newBin],
        currentBinId: newBin.id,
        currentConnectionIds: [newBin.connections[0].id],
        messages
      };
    }),

  addConnection: binId =>
    set(state => {
      let newConnection: IConnection = {
        id: generateId(IdPrefix.connection),
        name: `Connection ${state.bins.find(bin => bin.id == binId)!.connections.length + 1}`
      };

      let bin = state.bins.find(bin => bin.id == binId);
      if (bin) bin.connections = [...bin.connections, newConnection];

      return {
        bins: [...state.bins],
        currentConnectionIds: [...state.currentConnectionIds.slice(-3), newConnection.id]
      };
    }),

  toggleConnection: connectionId =>
    set(state => {
      let connectionIds = state.currentConnectionIds;

      if (connectionIds.includes(connectionId)) {
        connectionIds = connectionIds.filter(id => id != connectionId);
      } else {
        connectionIds = [...connectionIds.slice(-3), connectionId];
      }

      return {
        currentConnectionIds: connectionIds
      };
    }),

  updateConnection: (connectionId, updates) =>
    set(state => ({
      bins: state.bins.map(bin => ({
        ...bin,

        connections: bin.connections.map(connection => {
          if (connection.id == connectionId) {
            return { ...connection, ...updates };
          }

          return connection;
        })
      }))
    })),

  deleteConnection: connectionId =>
    set(state => {
      closeConnection(connectionId);

      return {
        bins: state.bins.map(bin => ({
          ...bin,

          connections: bin.connections.filter(connection => connection.id != connectionId)
        }))
      };
    }),

  setBin: binId =>
    set(state => {
      let bin = state.bins.find(bin => bin.id == binId);
      if (!bin) return {};

      return {
        currentBinId: binId,
        currentConnectionIds: bin.connections.map(c => c.id)
      };
    }),

  updateBin: (binId, updates) =>
    set(state => ({
      bins: state.bins.map(bin => {
        if (bin.id == binId) return { ...bin, ...updates };
        return bin;
      })
    })),

  clearMessages: connectionId =>
    set(state => ({
      messages: {
        ...state.messages,
        [connectionId]: []
      }
    }))
}));

let stateInitialized = false;
export let initState = () => {
  if (stateInitialized) return;
  stateInitialized = true;

  let state = localStorage.getItem('state');
  if (state) {
    useBinStore.setState(superjson.parse(state));
  }

  let store = useBinStore.getState();

  if (store.bins.length == 0) {
    store.addBin({
      name: 'Default',
      connections: [
        {
          name: 'Connection 1',
          url: 'wss://echo.metorial.com'
        }
      ],
      messages: [
        {
          type: MessageType.close,
          payload: 'Connection closed'
        },
        {
          type: MessageType.received,
          payload:
            'Welcome to Metorial Websocket Explorer. Connect to a websocket server to get started.'
        },
        {
          type: MessageType.open,
          payload: 'Connection opened'
        }
      ]
    });
  }

  useBinStore.subscribe(state => {
    localStorage.setItem(
      'state',
      superjson.stringify({
        bins: state.bins,
        currentBinId: state.currentBinId,
        currentConnectionIds: state.currentConnectionIds,
        messages: state.messages
      })
    );
  });
};

initState();
