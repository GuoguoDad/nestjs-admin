import { ApiProperty } from '@nestjs/swagger';

export class LoginUserInfoVO {
  @ApiProperty({ description: '用户Id' })
  userId: string;

  @ApiProperty({ description: '用户名' })
  name: string;

  @ApiProperty({ description: 'jwt' })
  token: string;
}
