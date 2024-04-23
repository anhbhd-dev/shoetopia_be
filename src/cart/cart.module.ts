import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.entity';
import { CartRepository } from './cart.repository';
import { UsersModule } from 'src/users/users.module';
import { VariationsModule } from 'src/variations/variations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    UsersModule,
    VariationsModule,
  ],
  providers: [CartService, CartRepository],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
