import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dtos/auth-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dtos/response-login.dto';
import { User } from 'src/users/users.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDTO: UserLoginDto): Promise<ResponseLoginDto> {
    const user = await this.userService.findOne(loginDTO);

    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      const tokens = this.generateTokens(user);
      return tokens;
    } else {
      throw new UnauthorizedException('Password incorrect');
    }
  }

  private generateTokens(user: User): ResponseLoginDto {
    const payload = { _id: user._id, email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  async refreshToken(user: User) {
    const payload = { _id: user._id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
