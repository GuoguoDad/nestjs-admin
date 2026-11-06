import { Injectable, Inject } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Users } from '../entity/user.entity'

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: Repository<Users>,
  ) {}

  async findAll() {
    return await this.userRepository.findAndCount({
      select: {
        _id: true,
        username: true,
        email: true,
        company: true,
      },
    })
  }
}
