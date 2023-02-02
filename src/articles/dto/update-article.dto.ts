import { IsNotEmpty } from "class-validator";

export class UpdateArticleDto {
  title: string;
  content: string;
  photo:string;
  }