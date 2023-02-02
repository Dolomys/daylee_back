import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>

@Schema()
export class Article {

    @Prop({required: true})
    title: string

    @Prop({required: true})
    content: string

    @Prop({required: true})
    photo: string

    @Prop({required: true})
    owner: string

    @Prop([String])
    categories: string[]

    @Prop([Object])
    comments: object[]
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
