import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/abstract/generic-repository';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel, ['category']);
  }
}
