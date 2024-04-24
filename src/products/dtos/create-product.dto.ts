import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isHot?: boolean;

  @IsBoolean()
  isActive?: boolean;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images: string[];
}
