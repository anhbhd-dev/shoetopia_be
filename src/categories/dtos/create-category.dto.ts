import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isShowAtHomePage?: boolean;
}
