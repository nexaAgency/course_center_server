import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@telegram-apps/init-data-node';
import { Request } from 'express';

export const TelegramUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.telegramUser;
  },
);
