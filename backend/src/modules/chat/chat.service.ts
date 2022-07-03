import { Injectable } from '@nestjs/common';
import {
  ChatMessageInterface,
  SocketUserInterface,
  SocketUserListInterface,
} from './types/chat.type';

@Injectable()
export class ChatService {
  public users: SocketUserInterface[] = [];
  public roomUsers: SocketUserListInterface = {};
  private messages: ChatMessageInterface[] = [];

  saveMessage(message: ChatMessageInterface) {
    const LIMIT = 30;
    const roomMessages = this.messages.filter(
      (msg) => msg.room === message.room,
    );
    if (roomMessages.length >= LIMIT) {
      this.messages.shift();
    }
    this.messages.push(message);
  }

  addUserInRoom(roomName: string, user: SocketUserInterface) {
    if (!this.roomUsers[roomName]) this.roomUsers[roomName] = [];
    this.roomUsers[roomName].push(user);
  }

  removeUserFromRoom(roomName: string, user: SocketUserInterface) {
    const roomUsers = this.roomUsers[roomName];
    const index = roomUsers.indexOf(user);
    if (index !== -1) roomUsers.splice(index, 1);
  }

  getLastMessages(roomName: string) {
    return this.messages.filter((message) => message.room === roomName);
  }
  getUserLastColor(mongoId: string) {
    const message = this.messages.find((msg) => msg.ownerUserId === mongoId);
    return message ? message.color : undefined;
  }
  getRoomUsers(roomName: string) {
    return this.roomUsers[roomName];
  }
  getRooms() {
    return Object.keys(this.roomUsers);
  }
  getAllUsers() {
    return this.users;
  }
}
