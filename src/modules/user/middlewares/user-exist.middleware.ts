import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from 'src/modules/repository/services/user.repository';

@Injectable()
export class UserExistMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const telegramId = req?.telegramUser.id;

    if (!telegramId) {
      throw new NotFoundException('Telegram User not found');
    }

    const user = await this.userRepository.findOneByTelegramId(telegramId);
    if (!user) throw new NotFoundException('User not found');

    req.user = user;

    next();
  }
}
