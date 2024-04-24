import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewRepository } from './reviews.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './reviews.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
