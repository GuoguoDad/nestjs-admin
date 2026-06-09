import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { LoggingInterceptor } from '../infrastructure/interceptor/logging.interceptor';
import { CatsService } from '../service/cats.service';
import { CreateCatReq } from '../dto/request/cat.req';
import { CatVO } from 'src/dto/response/cat.vo';

import { ParseIntPipe } from '../infrastructure/pipe/parse.int.pipe';

@ApiBearerAuth()
@ApiTags('CatsController')
@UseGuards(AuthGuard())
@UseInterceptors(new LoggingInterceptor())
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @ApiOperation({ summary: '添加猫' })
  @Post('/create')
  create(@Body() createCatDto: CreateCatReq): void {
    this.catsService.create(createCatDto);
  }

  @ApiOperation({ summary: '查询猫列表' })
  @Post('/queryAll')
  findAll(): CatVO[] {
    return this.catsService.findAll();
  }

  @Get('/queryOne/:id')
  findOne(@Param('id', new ParseIntPipe()) id) {
    return id;
  }
}
