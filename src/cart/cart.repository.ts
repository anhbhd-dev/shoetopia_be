import { Injectable } from '@nestjs/common';
import { Cart, CartDocument } from './cart.entity';
import { BaseRepository } from 'src/abstract/generic-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CartRepository extends BaseRepository<CartDocument> {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {
    super(cartModel, ['user', 'items.variation']);
  }
}
