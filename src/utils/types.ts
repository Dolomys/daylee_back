import { Types } from "mongoose";
import { Socket } from 'Socket.io';

export type PayloadType = {
  id: Types.ObjectId;
  username: string;
}

export type SocketWithAuth = Socket & PayloadType