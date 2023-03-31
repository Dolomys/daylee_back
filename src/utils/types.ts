import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { ArticleDocument } from 'src/articles/article.schema';
import { UserDocument } from 'src/users/user.schema';

export type PayloadType = {
  id: Types.ObjectId;
  username: string;
};

export type CreateStoryType = {
  filesUrls: string[];
  owner: UserDocument;
};

export type ArticleDocumentHasLiked = {
  article: ArticleDocument,
  hasLiked: boolean
}

export type SocketWithAuth = Socket & PayloadType;
