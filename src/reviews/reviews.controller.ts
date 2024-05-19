import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/decorators/user.decorator';
import { User } from 'src/users/users.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Review } from './reviews.entity';
import { ReviewsService } from './reviews.service';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @ExtractUserFromRequest() user: Partial<User>,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    createReviewDto.user = user._id as any;
    await this.reviewsService.createReview(createReviewDto);
  }

  @Get('product-id/:productId')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('productId') productId: string,
  ): Promise<Review[]> {
    return this.reviewsService.getAllReviews(page, limit, productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.getReviewById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('check-existed-review/:productId')
  async checkIsExistedReviewByUserAndProductId(
    @Param('productId') productId: string,
    @ExtractUserFromRequest() user: Partial<User>,
  ) {
    return await this.reviewsService.checkIsExistedReviewByUserAndProductId(
      user._id,
      productId,
    );
  }
}
