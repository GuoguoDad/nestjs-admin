import { Injectable, Inject } from '@nestjs/common';
import { FindOptionsSelect, Repository } from 'typeorm';
import { Users } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: Repository<Users>,
  ) {}

  async findAll() {
    const options: FindOptionsSelect<Users> = {
      _id: true,
      username: true,
      email: true,
      company: true,
    };
    return await this.userRepository.findAndCount({
      select: options,
    });
  }
}
