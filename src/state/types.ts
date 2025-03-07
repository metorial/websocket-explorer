export interface ISavedCommand {
  id: string;
  name: string;
  payload: string;
}

export interface IConnection {
  id: string;
  name: string;
  url?: string;

  ping?: {
    message: string;
    interval: number;
  };
}

export interface IBin {
  id: string;
  name: string;
  savedCommands: ISavedCommand[];
  connections: IConnection[];
}

export enum MessageType {
  sent = 'sent',
  received = 'received',
  open = 'open',
  close = 'close',
  error = 'error'
}

export interface IMessage {
  id: string;
  type: MessageType;
  payload: string;
  createdAt: Date;
}
