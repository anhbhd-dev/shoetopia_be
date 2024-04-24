import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/abstract/generic-repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './reviews.entity';

@Injectable()
export class ReviewRepository extends BaseRepository<ReviewDocument> {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {
    super(reviewModel, ['user', 'variation']);
  }
}
