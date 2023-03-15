import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ArticleOwnerGuard } from 'src/articles/utils/isOwner.guard';
import { FollowOwnerGuard } from 'src/follow/utils/isFollowing.guard';
import { JwtAuthGuard } from '../jwt-auth.guard';

export function Protect() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function ProtectOwner() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, ArticleOwnerGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function ProtectFollow() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, FollowOwnerGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
