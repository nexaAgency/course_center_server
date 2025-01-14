import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { StartAppPrefix } from '../enums/user.enums';
import { ParsedStartAppQuery } from '../interfaces/parsed-start-app-param.interface';

export const ParseStartAppQuery = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { startApp } = request.query;

    return parseStartAppQuery(startApp);
  },
);

function parseStartAppQuery(startAppQuery: string): ParsedStartAppQuery {
  if (startAppQuery?.startsWith(StartAppPrefix.ACCESS_CODE)) {
    return { accessCode: startAppQuery.slice(1) };
  }

  return {};
}
