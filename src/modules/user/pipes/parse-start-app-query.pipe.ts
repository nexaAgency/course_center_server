import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { StartAppPrefix } from '../enums/user.enums';
import { ParsedStartAppQuery } from '../interfaces/parsed-start-app-param.interface';

@Injectable()
export class ParseStartAppQueryPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (!value?.startApp) return {};

    return this.parseStartAppQuery(value.startApp);
  }

  private parseStartAppQuery(startAppQuery: string): ParsedStartAppQuery {
    if (startAppQuery.startsWith(StartAppPrefix.ACCESS_CODE)) {
      return {
        accessCode: startAppQuery.slice(StartAppPrefix.ACCESS_CODE.length),
      };
    }

    return {};
  }
}
