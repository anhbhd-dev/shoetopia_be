import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('keyword') keyword?: string,
  ): Promise<User[]> {
    return await this.userService.findAll(+page, +limit, { keyword });
  }
  @Get('reset-password')
  async resetPassword(@Query('email') email: string) {
    return await this.userService.resetPassword(email);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @IdParam('id') @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Put('password/:id')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @IdParam('id') @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updatePassword(id, updateUserDto);
  }
}
