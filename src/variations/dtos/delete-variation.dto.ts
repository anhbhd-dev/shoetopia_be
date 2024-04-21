import { IsMongoId } from 'class-validator';

export class DeleteVariationDto {
  @IsMongoId()
  productId: string;
}
