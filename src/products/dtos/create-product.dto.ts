import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Variation } from 'src/variations/variations.entity';

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

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  variations: Variation[];
}
