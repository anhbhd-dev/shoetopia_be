import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isHot?: boolean;

  @IsString()
  categoryId: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images: string[];
}
