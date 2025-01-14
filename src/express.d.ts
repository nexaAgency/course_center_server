import { User as MiniAppUser } from '@telegram-apps/init-data-node';

import { User } from './modules/user/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    telegramUser?: MiniAppUser;
    user?: User;
  }
}
