import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { UserDocument } from 'src/users/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userMapper: UserMapper,
    private readonly userRepository: UsersRepository,
  ) {}

  getUserFollowers = (user: UserDocument) =>
    this.followRepository
      .getUserFollowersByIdOrThrow(user.id)
      .then((followers) => followers.map((follower) => this.userMapper.toGetUserLightDto(follower.follower)));

  getUserFollowing = (user: UserDocument) =>
    this.followRepository
      .getUserFollowingsByIdOrThrow(user.id)
      .then((followings) => followings.map((following) => this.userMapper.toGetUserLightDto(following.following)));

  async followUser(follower: UserDocument, following: UserDocument) {
    if (follower.followingsCount >= follower.followingSlots) throw new UnauthorizedException('FOLLOWING_LIMIT_REACHED');
    if (following.id === follower.id) throw new UnauthorizedException('CANNOT_FOLLOW_YOURSELF');
    const isFollowing = await this.followRepository.isFollowing(follower, following.id);
    if (isFollowing) throw new UnauthorizedException('ALREADY_FOLLOWING');
    await this.userRepository.addFollowCount(follower, following);
    return this.followRepository.followUserOrThrow(follower, following);
  }

  removeFollower = (user: UserDocument, following: UserDocument) =>
    this.followRepository.removeFollowerOrThrow(user, following);

  removeFollowing = (user: UserDocument, follower: UserDocument) =>
    this.followRepository.removeFollowingOrThrow(user, follower);
}
