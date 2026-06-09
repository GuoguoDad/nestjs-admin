import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Users } from '../../entity/user.entity';

@Injectable()
export class CommonAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject('UserRepository')
    private readonly userRepository: Repository<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('没找到用户!');
    }
    try {
      const payload = await this.jwtService.verify(token);

      const { name } = payload;
      const entity = await this.userRepository.findOne({
        where: { username: name },
      });
      if (!entity) {
        throw new UnauthorizedException('没找到用户!');
      }
      request['user'] = entity;
    } catch {
      throw new UnauthorizedException('没找到用户!');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    console.log('====request.headers:', request.headers);
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
