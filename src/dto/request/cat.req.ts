import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, IsNotEmpty, IsIn } from 'class-validator';

export class CreateCatReq {
  @Length(2, 8, { message: '名称必须2到8字符' })
  @IsString({ message: '名称必须是字符类型' })
  @IsNotEmpty({ message: '名称不可为空' })
  @ApiProperty({
    required: true,
    type: String,
    example: '小黑',
    description: '名称',
    minLength: 2,
    maxLength: 8,
  })
  name: string;

  @IsInt({ message: '年龄必须是数字' })
  @ApiProperty({
    required: true,
    type: Number,
    example: 2,
    description: '年龄',
  })
  age: number;

  @IsString({ message: '品种必须是字符' })
  @IsNotEmpty({ message: '品种不可为空' })
  @IsIn(['泰迪', '柯基'], { message: '不支持该品种' })
  @ApiProperty({
    required: true,
    example: '泰迪',
    description: '品种',
    enum: ['泰迪', '柯基'],
  })
  breed: string;
}
