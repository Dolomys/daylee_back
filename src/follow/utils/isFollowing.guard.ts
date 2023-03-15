import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FollowRepository } from '../follow.repository';

@Injectable()
export class FollowOwnerGuard implements CanActivate {
  constructor(private readonly followRepository: FollowRepository) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = request.params.userId;
    return this.followRepository.isFollowing(user, userId);
  }
}
