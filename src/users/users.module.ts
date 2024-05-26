import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersAdminController } from './users.admin.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'shoetopia.shoes.store@gmail.com',
          pass: 'jyiq bjjb xlxh ycrr',
        },
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
