import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  photo: string;

  @IsNotEmpty()
  owner: string;

  }