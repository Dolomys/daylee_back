import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ArticleOwnerGuard } from 'src/articles/utils/isOwner.guard';
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
