import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserMapper } from "src/users/user.mapper";
import { UserDocument } from "src/users/user.schema";
import { UsersRepository } from 'src/users/users.repository';
import { FollowRepository } from "./follow.repository";

@Injectable()
export class FollowService {
    constructor(private readonly followRepository: FollowRepository, private readonly userMapper: UserMapper, private readonly userRepository: UsersRepository){}

     getUserFollowers = (user: UserDocument) =>
       this.followRepository.getUserFollowersByIdOrThrow(user.id).then(followers => this.userMapper.toGetUsersLightListDto(followers))
      
    
      getUserFollowing = (user: UserDocument) =>
        this.followRepository.getUserFollowingsByIdOrThrow(user.id).then(followings => this.userMapper.toGetUsersLightListDto(followings))
          
      
      async followUser(follower: UserDocument, following: UserDocument) {
        if (follower.followingsCount >= follower.followingSlots)
          throw new UnauthorizedException('FOLLOWING_LIMIT_REACHED');
        if(following === follower)
          throw new UnauthorizedException('CANNOT_FOLLOW_YOURSELF');
        await this.userRepository.addFollowCount(follower, following)
        return this.followRepository
          .followUserOrThrow(follower, following)
      }
}