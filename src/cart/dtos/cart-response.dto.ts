export class CartResponseDto {
  items: any[];
  totalPrice: number;
  shippingFee?: number;
  shippingFeePercentage?: number;
  totalAmount?: number;
}
