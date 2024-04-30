import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  readonly isEnabled?: boolean;
}
