import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from 'src/constant/enum/order.enum';

export class CreateOrderDto {
  user: string;
  receiverName: string;
  shippingAddress: string;
  phoneNumber: string;
  orderItems: Record<string, any>[];
  totalPrice: number;
  shippingFee: number;
  shippingFeePercentage: number;
  totalAmount: number;
  orderStatus: [OrderStatus];
  payment: {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
  };
}

export class PaymentDto {
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @IsOptional()
  paymentStatus: PaymentStatus;
}

export class RequestCreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  receiverName: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  shippingAddress: string;

  @IsNotEmpty()
  @IsOptional()
  phoneNumber: string;

  @ValidateNested()
  @IsNotEmpty()
  payment: PaymentDto;
}
