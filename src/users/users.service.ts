import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilterQuery } from 'mongoose';
import { User } from './users.entity';
import { UserLoginDto } from 'src/auth/dtos/auth-login.dto';
@Injectable()
export class UsersService {
  logger: Logger;
  constructor(private readonly userRepository: UsersRepository) {
    this.logger = new Logger(UsersService.name);
  }

  async findAll(
    page: number,
    limit: number,
    filter?: FilterQuery<User>,
  ): Promise<User[]> {
    const queryFilter: FilterQuery<User> = {};

    if (filter?.keyword) {
      const keyFilter = {
        $regex: filter.keyword ?? '',
        $options: 'i',
      };

      queryFilter['$or'] = [
        { firstName: keyFilter },
        { lastName: keyFilter },
        { email: keyFilter },
      ];
    }

    const userData = await this.userRepository.findAll(
      page,
      limit,
      queryFilter,
    );
    const usersDataResponse = userData.map((user) => {
      delete user.password;
      return user;
    });
    return usersDataResponse;
  }

  async findOneByEmail(userData: Partial<UserLoginDto>): Promise<User> {
    const user = await this.userRepository.findByCondition({
      email: userData.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    userDto.password = await bcrypt.hash(userDto.password, salt);

    // check exists
    const userInDb = await this.userRepository.findByCondition({
      email: userDto.email,
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const userRes = await this.userRepository.create(userDto);
    const userPlain = userRes;
    delete userPlain.password;
    return userPlain;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.findByIdAndUpdate(id, updateUserDto);
  }
}
