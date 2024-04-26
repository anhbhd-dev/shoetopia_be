import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Review } from './reviews.entity';
import { ReviewRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const existingReview = await this.reviewRepository.findByCondition({
      user: createReviewDto.user,
      variation: createReviewDto.variation,
    });
    if (existingReview) {
      throw new BadRequestException('Review already exists');
    }
    return await this.reviewRepository.create(createReviewDto);
  }

  async getReviewById(id: string): Promise<Review> {
    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview) {
      throw new NotFoundException('Review not found');
    }
    return existingReview;
  }

  async getAllReviews(page: number, limit: number): Promise<Review[]> {
    return await this.reviewRepository.findAll(page, limit);
  }
}
