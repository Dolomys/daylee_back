import { Types } from 'mongoose';

export interface LastTimeUserLeftInterface {
  userId: Types.ObjectId;
  lastDisconnect: Date;
}
