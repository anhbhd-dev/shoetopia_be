import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from 'src/cart/cart.module';
import { Order, OrderSchema } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { UsersModule } from 'src/users/users.module';
import { OrdersAdminController } from './orders.admin.controller';
import { ProductsModule } from 'src/products/products.module';
import { VariationsModule } from 'src/variations/variations.module';

@Module({
  imports: [
    ProductsModule,
    CartModule,
    UsersModule,
    VariationsModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrdersService, OrderRepository],
  controllers: [OrdersController, OrdersAdminController],
  exports: [OrdersService],
})
export class OrdersModule {}
