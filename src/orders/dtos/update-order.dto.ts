import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { OrderStatus, PaymentStatus } from 'src/constant/enum/order.enum';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;
}
