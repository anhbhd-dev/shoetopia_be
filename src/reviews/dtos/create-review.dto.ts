import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  content: string;

  @IsNumber()
  rating: number;

  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  productId: string;
}
