import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, EntityManager } from 'typeorm';

import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource);
  }

  async findOneByTelegramId(telegramId: number): Promise<User> {
    return await this.findOneBy({ telegramId });
  }

  getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(User) : this;
  }

  async getBatchOfUsers(offset: number, limit: number): Promise<User[]> {
    return await this.createQueryBuilder('user')
      .andWhere('user.id > :offset', { offset })
      .orderBy('user.id')
      .limit(limit)
      .getMany();
  }
}
