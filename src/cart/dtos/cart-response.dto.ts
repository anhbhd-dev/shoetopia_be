export class CartResponseDto {
  items: Item[];
  totalPrice: number;
  shippingFee?: number;
  shippingFeePercentage?: number;
  totalAmount?: number;
}

export class Item {
  images: string[];
  isActive: boolean;
  _id: string;
  name: string;
  description: string;
  isHot: boolean;
  variation: Variation;
  quantity: number;
  id: string;
}

export class Variation {
  _id: string;
  size: string;
  availableQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  salePrice: number;
  unitPrice: number;
  id: string;
}
