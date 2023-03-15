import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  message: string;

  @Prop()
  sender: string;

  @Prop()
  recipient: string;
}


export const ChatSchema = SchemaFactory.createForClass(Chat);