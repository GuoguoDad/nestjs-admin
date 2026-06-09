import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Users } from '../../entity/user.entity';
import { ConfigService } from 'src/service/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,

    @Inject('UserRepository')
    private readonly userRepository: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getString('secretKey'),
    });
  }

  async validate(payload, done: VerifiedCallback) {
    const { name } = payload;
    const entity = await this.userRepository.findOne({
      where: { username: name },
    });

    if (!entity) {
      throw new UnauthorizedException('没找到用户!');
    }
    return done(null, entity);
  }
}
