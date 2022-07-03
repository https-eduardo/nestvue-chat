import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { isJWT } from 'class-validator';
import { ChatMessageInterface } from './types/chat.type';
import { generateLightHex } from 'src/utils/colors';

@WebSocketGateway({
  namespace: 'chat',
  cors: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly service: ChatService,
    private readonly authService: AuthService,
  ) { }

  async handleConnection(client: Socket) {
    let decodedData: { id: string; username: string };
    const { authorization } = client.handshake.headers;
    const token = authorization.split(' ')[1];
    if (!isJWT(token)) return client.disconnect();
    try {
      decodedData = await this.authService.validateToken(token);
    } catch { }
    if (!decodedData) return client.disconnect();
    const lastColor = this.service.getUserLastColor(decodedData.id);
    this.service.users.push({
      id: client.id,
      mongoId: decodedData.id,
      username: decodedData.username,
      isTyping: false,
      color: lastColor ?? generateLightHex(),
    });
    client.emit('myInfo', { ...decodedData });
  }
  @SubscribeMessage('enterRoom')
  async handleRoomJoin(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (roomName) {
      const user = this.getSocketUser(client.id);
      client.join(roomName);
      this.service.addUserInRoom(roomName, user);
      for (const room of this.service.getRooms()) {
        if (room !== roomName) this.service.removeUserFromRoom(room, user);
        client.to(room).emit('usersList', this.service.getRoomUsers(room));
        if (room !== roomName) client.leave(room);
      }
      const roomUsers = this.service.getRoomUsers(roomName);
      client.emit('lastMessages', this.service.getLastMessages(roomName));
      return { event: 'usersList', data: roomUsers };
    }
  }

  handleDisconnect(client: Socket) {
    const socketUser = this.getSocketUser(client.id);
    for (const room of this.service.getRooms()) {
      this.service.removeUserFromRoom(room, socketUser);
      client.to(room).emit('usersList', this.service.getRoomUsers(room));
    }
    const index = this.service.users.indexOf(socketUser);
    this.service.users.splice(index, 1);
  }

  @SubscribeMessage('newMessage')
  handleMessage(
    @MessageBody() body: { message: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const socketUser = this.getSocketUser(client.id);
    if (!socketUser) return client.disconnect();
    if (!body.message || body.message.trim() === '') return;
    const message: ChatMessageInterface = {
      username: socketUser.username,
      content: body.message.trim(),
      createdAt: new Date(),
      ownerUserId: socketUser.mongoId,
      color: socketUser.color,
      room: body.room,
    };
    client.to(body.room).emit('newMessage', message);
    this.service.saveMessage(message);
    return { event: 'newMessage', data: message };
  }
  @SubscribeMessage('isTyping')
  handleTyping(
    @MessageBody() body: { value: boolean; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const socketUser = this.getSocketUser(client.id);
    if (!socketUser) return client.disconnect();
    socketUser.isTyping = !!body.value;
    const typingUsers = this.service.users.filter((user) => user.isTyping);
    client.to(body.room).emit('typingList', typingUsers);
    return { event: 'typingList', data: typingUsers };
  }
  getSocketUser(id: string) {
    return this.service.users.find((user) => user.id === id);
  }
}
