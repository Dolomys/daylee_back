import { Types } from "mongoose";

export interface PayloadInterface {
  id: Types.ObjectId;
  username: string;
}
