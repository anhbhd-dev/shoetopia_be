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
import { ExtractUserFromRequest } from 'src/decorators/user.decorator';
import { User } from 'src/users/users.entity';

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
    @Query('productId') productId,
  ): Promise<Review[]> {
    return this.reviewsService.getAllReviews(page, limit, {
      product: productId,
    });
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
