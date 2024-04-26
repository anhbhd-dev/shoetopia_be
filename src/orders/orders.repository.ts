import { BaseRepository } from 'src/abstract/generic-repository';
import { Order, OrderDocument } from './order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel, ['user', 'orderItems.variation']);
  }
}
