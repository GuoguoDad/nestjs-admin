import { Injectable } from '@nestjs/common';
import { CatVO } from 'src/dto/response/cat.vo';

@Injectable()
export class CatsService {
  private readonly cats: CatVO[] = [];

  create(cat: CatVO) {
    this.cats.push(cat);
  }

  findAll(): CatVO[] {
    return this.cats;
  }
}
