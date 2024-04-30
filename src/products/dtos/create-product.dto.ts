import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  categoryId: string;

  @IsString()
  avatar: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
