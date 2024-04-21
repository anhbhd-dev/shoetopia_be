import { IsString, IsNumber } from 'class-validator';

export class CartItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}
