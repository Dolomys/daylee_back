import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { ArticleOwnerGuard } from 'src/articles/utils/isOwner.guard';
import { FollowOwnerGuard } from 'src/follow/utils/isFollowing.guard';
import { JwtAuthGuard } from '../../auth/utils/jwt-auth.guard';

export function Protect() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'FORBIDDEN' }),
  );
}

export function ProtectOwner() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, ArticleOwnerGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'FORBIDDEN' }),
  );
}

export function ProtectFollow() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, FollowOwnerGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'FORBIDDEN' }),
  );
}
