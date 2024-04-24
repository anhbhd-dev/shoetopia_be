import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from 'src/cart/cart.module';
import { Order, OrderSchema } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    CartModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrdersService, OrderRepository],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
