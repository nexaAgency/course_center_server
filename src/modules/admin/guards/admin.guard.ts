import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { configuration } from 'src/config/configuration';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const userTelegramId = request?.telegramUser?.id;

    if (userTelegramId) {
      return configuration.telegram.adminIds?.includes(String(userTelegramId));
    }

    return false;
  }
}
