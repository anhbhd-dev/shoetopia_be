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

  // @Get(':id')
  // async findOne(@IdParam('id') @Param('id') id: string): Promise<User> {
  //   return this.userService.findOne(id);
  // }

  @Put(':id')
  async update(
    @IdParam('id') @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
