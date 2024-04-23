import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayloadData } from 'src/types/auth.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
    });
  }

  async validate(payload: JWTPayloadData) {
    const user = await this.userService.findOneByEmail({
      email: payload.email,
    });
    const userData = (user as any).toJSON();
    delete userData.password;
    return userData;
  }
}
