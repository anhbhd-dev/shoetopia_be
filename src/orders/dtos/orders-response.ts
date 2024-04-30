import { Order } from '../order.entity';

export type OrdersListResponse = {
  orders: Order[] | any[];
  totalPage: number;
  totalDocs: number;
};
