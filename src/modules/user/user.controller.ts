import { Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User as MiniAppUser } from '@telegram-apps/init-data-node';
import { ApiTelegramAuth } from 'src/common/decorators/telegram-auth.decorator';

import { TelegramUser } from '../auth/decorators/telegram-user.decorator';
import { JoinResponseDto } from './dto/response/join-response.dto';
import { ParsedStartAppQuery } from './interfaces/parsed-start-app-param.interface';
import { ParseStartAppQueryPipe } from './pipes/parse-start-app-query.pipe';
import { UserService } from './services/user.service';

@Controller('users')
@ApiTelegramAuth()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create or return an existing user',
    description:
      'This endpoint either creates a new user or returns an existing user',
  })
  @ApiQuery({
    name: 'startApp',
    type: 'string',
    required: false,
  })
  @Post('join')
  async join(
    @TelegramUser() telegramUser: MiniAppUser,
    @Query(ParseStartAppQueryPipe) parsedQuery: ParsedStartAppQuery,
  ): Promise<JoinResponseDto> {
    return await this.userService.join(telegramUser, parsedQuery);
  }
}
