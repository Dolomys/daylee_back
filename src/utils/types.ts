import { Types } from 'mongoose';
import { Socket } from 'socket.io';

export type PayloadType = {
  id: Types.ObjectId;
  username: string;
};

export type SocketWithAuth = Socket & PayloadType;
