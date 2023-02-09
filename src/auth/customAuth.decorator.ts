import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const ConnectedUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest().user;
  if (!user) throw new UnauthorizedException("CAN'T_GET_CONNECTED_USER");
  return user;
});
