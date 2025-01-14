import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { parse, validate } from '@telegram-apps/init-data-node';
import { NextFunction, Request, Response } from 'express';
import { configuration } from 'src/config/configuration';

@Injectable()
export class InitDataMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const initDataHash = this.getInitDataFromHeaders(req);

    try {
      validate(initDataHash, configuration.telegram.token);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    const initData = parse(initDataHash);

    req.telegramUser = initData.user;

    next();
  }

  private getInitDataFromHeaders(req: Request): string {
    const initDataHash = req.headers['initdata'] as string;

    if (!initDataHash) {
      throw new UnauthorizedException('Missing initData header');
    }

    return initDataHash;
  }
}
