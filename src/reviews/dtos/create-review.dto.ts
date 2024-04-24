import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  content: string;

  @IsNumber()
  rating: number;

  @IsMongoId()
  user: string;

  @IsMongoId()
  variation: string;
}
