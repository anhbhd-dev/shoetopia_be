import { Product } from '../product.entity';

export type ProductsListResponse = {
  products: Product[];
  totalPage: number;
  totalDocs: number;
};
