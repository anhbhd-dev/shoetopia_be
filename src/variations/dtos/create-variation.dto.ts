import { IsString, IsNumber } from 'class-validator';

export class CreateVariationDto {
  @IsString()
  size: string;

  @IsNumber()
  availableQuantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  salePrice: number;

  @IsString()
  productId: string;
}
