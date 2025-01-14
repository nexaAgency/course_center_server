import { applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

export function ApiTelegramAuth() {
  return applyDecorators(ApiSecurity('telegram-init-data'));
}
