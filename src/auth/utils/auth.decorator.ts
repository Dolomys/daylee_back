import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ArticleOwnerGuard } from 'src/articles/utils/isOwner.guard';
import { JwtAuthGuard } from '../jwt-auth.gard';

export function Auth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function AuthOwner() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, ArticleOwnerGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
