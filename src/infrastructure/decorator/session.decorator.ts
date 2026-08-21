import { createParamDecorator } from '@nestjs/common'
import { Users } from '../../entity/user.entity'

export const SessionUser = createParamDecorator((): Users => {
  return { _id: '', company: '', email: '', mobile: '', password: '', qq: '', username: '' }
})
