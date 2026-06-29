import { DataSource } from 'typeorm'
import { Users } from '../entity/user.entity'

export const UserProvider = {
  provide: 'UserRepository',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
  inject: ['CommonDataSource'],
}
