import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExtractUserFromRequest } from 'src/decorators/user.decorator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dtos/auth-login.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body()
    userLoginDto: UserLoginDto,
  ) {
    return this.authService.validateUser(userLoginDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@ExtractUserFromRequest() user: User) {
    return this.authService.refreshToken(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('admin/login')
  adminLogin(
    @Body()
    userLoginDto: UserLoginDto,
  ) {
    return this.authService.validateAdmin(userLoginDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('admin/refresh')
  async adminRefreshToken(@ExtractUserFromRequest() user: User) {
    return this.authService.refreshTokenAdmin(user);
  }
}
