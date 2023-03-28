import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { UserDocument } from 'src/users/user.schema';

export type PayloadType = {
  id: Types.ObjectId;
  username: string;
};

export type CreateStoryType = {
  filesUrls: string[];
  owner: UserDocument;
};

export type SocketWithAuth = Socket & PayloadType;
