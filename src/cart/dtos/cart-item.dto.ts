import { IsNumber, IsMongoId } from 'class-validator';

export class CartItemDto {
  @IsMongoId()
  variationId: string;

  @IsNumber()
  quantity: number;
}
