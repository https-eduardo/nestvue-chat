export interface SocketUserListInterface {
  [key: string]: SocketUserInterface[];
}

export interface SocketUserInterface {
  id: string;
  username: string;
  mongoId: string;
  isTyping: boolean;
  color?: string;
}

export interface ChatMessageInterface {
  username: string;
  content: string;
  createdAt: Date;
  ownerUserId: string;
  color?: string;
  room: string;
}
