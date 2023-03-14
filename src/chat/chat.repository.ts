import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "./chat.schema";

@Injectable()
export class ChatRepository {
    constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

    getChats = () => this.chatModel.find()

    async saveChat(chat: Chat){
       const newChat =  this.chatModel.create(chat)
       console.log(newChat)
    }
}