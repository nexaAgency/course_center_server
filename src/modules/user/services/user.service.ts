import { Injectable, NotFoundException } from '@nestjs/common';
import { User as MiniAppUser } from '@telegram-apps/init-data-node';
import { UserRepository } from 'src/modules/repository/services/user.repository';
import { Transactional } from 'typeorm-transactional';

import { JoinResponseDto } from '../dto/response/join-response.dto';
import { User } from '../entities/user.entity';
import { ParsedStartAppQuery } from '../interfaces/parsed-start-app-param.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  @Transactional()
  async join(
    telegramUser: MiniAppUser,
    _parsedQuery: ParsedStartAppQuery,
  ): Promise<JoinResponseDto> {
    let user = await this.userRepository.findOneByTelegramId(telegramUser.id);

    if (!user) {
      user = this.createInstance(telegramUser);
      user = await this.userRepository.save(user);
    }

    await this.syncTelegramUserData(user, telegramUser);

    return user;
  }

  async getByTelegramIdOrThrow(telegramId: number): Promise<User> {
    const user = await this.userRepository.findOneByTelegramId(telegramId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  private createInstance(telegramUser: MiniAppUser): User {
    return this.userRepository.create({
      telegramId: telegramUser.id,
      firstName: telegramUser.firstName,
      username: telegramUser.username,
      lastName: telegramUser.lastName,
      isPremium: telegramUser.isPremium,
      languageCode: telegramUser.languageCode,
    });
  }

  private async syncTelegramUserData(
    user: User,
    telegramUser: MiniAppUser,
  ): Promise<User | null> {
    const fieldsToUpdate: Partial<User> = {
      languageCode: telegramUser.languageCode,
      username: telegramUser.username,
      lastName: telegramUser.lastName,
      firstName: telegramUser.firstName,
      isPremium: telegramUser.isPremium,
    };

    const updates = Object.keys(fieldsToUpdate).reduce((acc, key) => {
      if (user[key] !== fieldsToUpdate[key]) {
        acc[key] = fieldsToUpdate[key];
      }
      return acc;
    }, {} as Partial<User>);

    if (Object.keys(updates).length > 0) {
      Object.assign(user, updates);
      return await this.userRepository.save(user);
    }
  }
}
