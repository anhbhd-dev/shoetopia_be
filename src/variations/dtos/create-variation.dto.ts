import { IsString, IsNumber } from 'class-validator';

export class CreateVariationDto {
  @IsString()
  size: string;

  @IsNumber()
  availableQuantity: number;

  @IsString()
  productId: string;
}
