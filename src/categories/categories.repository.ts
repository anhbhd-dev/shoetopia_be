import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './categories.entity';
import { BaseRepository } from 'src/abstract/generic-repository';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }
}
