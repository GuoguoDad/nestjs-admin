import { createParamDecorator } from '@nestjs/common';
import { Users } from '../../entity/user.entity';

export const SessionUser = createParamDecorator((data, req): Users => {
  return req.user;
});
