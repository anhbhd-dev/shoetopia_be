import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('api/v1/admin/users')
@UseGuards(JwtAuthGuard)
export class UsersAdminController {
  constructor(private readonly userService: UsersService) {}

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

  @Put('password/:id')
  async updatePassword(
    @IdParam('id') @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updatePassword(id, updateUserDto);
  }
}
