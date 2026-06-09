import { ApiProperty } from '@nestjs/swagger';

export class CatVO {
  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '年龄' })
  age: number;

  @ApiProperty({ description: '品种' })
  breed: string;
}
