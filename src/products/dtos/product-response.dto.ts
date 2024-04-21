export class ProductResponseDto {
  images: string[];
  _id: string;
  name: string;
  description: string;
  unitPrice: number;
  salePrice: number;
  isHot: boolean;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  variations: Variation[];
}

class Category {
  _id: string;
  name: string;
}

class Variation {
  _id: string;
  size: string;
  availableQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}
