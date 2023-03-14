import { ApiProperty } from "@nestjs/swagger";
import { Types } from 'mongoose';
import { GetUserDtoLight } from "src/users/utils/dto/response/get-user-light.dto";

export class GetArticleLightDto {
    @ApiProperty()
    id: Types.ObjectId;
    
    @ApiProperty()
    owner: GetUserDtoLight;

    @ApiProperty()
    commentCount?: number;

    @ApiProperty()
    likeCount?: number;
  }