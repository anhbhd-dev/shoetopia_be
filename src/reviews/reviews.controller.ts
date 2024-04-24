import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateReviewDto } from './dtos/create-review.dto';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Review } from './reviews.entity';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReviewDto: CreateReviewDto) {
    await this.reviewsService.createReview(createReviewDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Review[]> {
    return this.reviewsService.getAllReviews(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.getReviewById(id);
  }
}
