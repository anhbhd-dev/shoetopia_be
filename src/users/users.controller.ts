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
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('keyword') keyword?: string,
  ): Promise<User[]> {
    return await this.userService.findAll(+page, +limit, { keyword });
  }

  @Put(':id')
  async update(
    @IdParam('id') @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
