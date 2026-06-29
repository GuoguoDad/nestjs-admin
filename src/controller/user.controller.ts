import { Controller, Post } from '@nestjs/common'
import { UserService } from '../service/user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/queryAllUsers')
  async queryAllUsers() {
    return await this.userService.findAll()
  }
}
