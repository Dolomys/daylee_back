import { IsNotEmpty } from "class-validator";

export class NewCommentary {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  owner: string;
}