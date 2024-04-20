import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  unitPrice: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  salePrice: number;

  @IsBoolean()
  isHot?: boolean;

  @IsString()
  categoryId: string;
}
