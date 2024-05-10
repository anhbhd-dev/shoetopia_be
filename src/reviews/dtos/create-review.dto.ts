import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  content: string;

  @IsNumber()
  rating: number;

  @IsMongoId()
  @IsOptional()
  user?: string;

  @IsMongoId()
  variation: string;
}
