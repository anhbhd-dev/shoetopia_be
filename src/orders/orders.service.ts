import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './orders.repository';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto, RequestCreateOrderDto } from './dtos/create-order-dto';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from 'src/constant/enum/order.enum';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './order.entity';
import { OrdersListResponse } from './dtos/orders-response';
import { FilterQuery } from 'mongoose';
import { OrderBy } from 'src/types/order-by.type';
import { SortBy } from 'src/types/sort-by.type';
import { ProductsService } from 'src/products/products.service';
import ShortUniqueId from 'short-unique-id';
@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
  ) {}

  async findAllAdmin(
    page: number,
    limit: number,
    filter?: FilterQuery<Order>,
    sortBy?: SortBy,
    order?: OrderBy,
  ): Promise<OrdersListResponse> {
    const queryFilter: FilterQuery<Order> = {};
    if (filter) {
      if (filter['orderCode'])
        queryFilter['orderCode'] = {
          $regex: filter['orderCode'],
          $options: 'i',
        };

      switch (filter['orderStatus']) {
        case OrderStatus.PENDING:
          queryFilter['orderStatus'] = [OrderStatus.PENDING];
          break;
        case OrderStatus.PROCESSING:
          queryFilter['orderStatus'] = [
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
          ];
          break;
        case OrderStatus.SHIPPING:
          queryFilter['orderStatus'] = [
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPING,
          ];
          break;
        case OrderStatus.DELIVERED:
          queryFilter['orderStatus'] = [
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPING,
            OrderStatus.DELIVERED,
          ];
          break;

        case OrderStatus.CANCELLED:
          queryFilter['orderStatus'] = { $in: ['CANCELLED'] };
          break;
        default:
          break;
      }
    }

    const sortOption = order === OrderBy.ASC ? 'asc' : 'desc';

    const res = await this.orderRepository.findAllWithFullFilters(
      page,
      limit,
      queryFilter,
      sortBy,
      sortOption,
    );

    res.data.forEach((order) => {
      delete (order.user as any).password;
    });

    const mappedOrdersList = await Promise.all(
      res.data.map(async (order) => {
        const mappedOrderItems = await Promise.all(
          order.orderItems.map(async (orderItem) => {
            const productInfo = await this.productService.findOneByCondition({
              variations: orderItem.variation._id,
            });
            delete productInfo.variations;
            delete productInfo.category;
            const orderItemFullData = {
              ...orderItem,
              product: productInfo,
            };
            return orderItemFullData;
          }),
        );

        const mappedOrder = {
          ...order,
          orderItems: mappedOrderItems,
        };
        return mappedOrder;
      }),
    );

    return {
      orders: mappedOrdersList,
      totalPage: res.totalPage,
      totalDocs: res.totalDocs,
    };
  }

  async findAll(
    user: Partial<User>,
    page: number,
    limit: number,
    filter?: FilterQuery<Order>,
    sortBy?: SortBy,
    order?: OrderBy,
  ): Promise<OrdersListResponse> {
    const queryFilter: FilterQuery<Order> = {};
    queryFilter['user'] = user._id;
    if (filter) {
      if (filter['orderCode'])
        queryFilter['orderCode'] = {
          $regex: filter['orderCode'],
          $options: 'i',
        };

      switch (filter['orderStatus']) {
        case OrderStatus.PENDING:
          queryFilter['orderStatus'] = [OrderStatus.PENDING];
          break;
        case OrderStatus.PROCESSING:
          queryFilter['orderStatus'] = [
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
          ];
          break;
        case OrderStatus.SHIPPING:
          queryFilter['orderStatus'] = [
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPING,
          ];
          break;
        case OrderStatus.DELIVERED:
          queryFilter['orderStatus'] = [
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPING,
            OrderStatus.DELIVERED,
          ];
          break;

        case OrderStatus.CANCELLED:
          queryFilter['orderStatus'] = { $in: ['CANCELLED'] };
          break;
        default:
          break;
      }
    }

    const sortOption = order === OrderBy.ASC ? 'asc' : 'desc';

    const res = await this.orderRepository.findAllWithFullFilters(
      page,
      limit,
      queryFilter,
      sortBy,
      sortOption,
    );

    res.data.forEach((order) => {
      delete (order.user as any).password;
    });

    const mappedOrdersList = await Promise.all(
      res.data.map(async (order) => {
        const mappedOrderItems = await Promise.all(
          order.orderItems.map(async (orderItem) => {
            const productInfo = await this.productService.findOneByCondition({
              variations: orderItem.variation._id,
            });
            delete productInfo.variations;
            delete productInfo.category;
            const orderItemFullData = {
              ...orderItem,
              product: productInfo,
            };
            return orderItemFullData;
          }),
        );

        const mappedOrder = {
          ...order,
          orderItems: mappedOrderItems,
        };
        return mappedOrder;
      }),
    );

    return {
      orders: mappedOrdersList,
      totalPage: res.totalPage,
      totalDocs: res.totalDocs,
    };
  }

  async getOrderByIdAdmin(orderId: string) {
    const order = await this.orderRepository.findById(orderId);

    const mappedOrder = await Promise.all(
      order.orderItems.map(async (orderItem) => {
        const productInfo = await this.productService.findOneByCondition({
          variations: orderItem.variation._id,
        });
        delete productInfo.variations;
        delete productInfo.category;
        const orderItemFullData = {
          ...orderItem,
          product: productInfo,
        };
        return orderItemFullData;
      }),
    );

    order.orderItems = mappedOrder;

    delete (order.user as any).password;
    return order;
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.orderRepository.findById(orderId);

    if (!order || (order as any).user._id.toString() !== userId)
      throw new NotFoundException('Order not found');
    const mappedOrder = await Promise.all(
      order.orderItems.map(async (orderItem) => {
        const productInfo = await this.productService.findOneByCondition({
          variations: orderItem.variation._id,
        });
        delete productInfo.variations;
        delete productInfo.category;
        const orderItemFullData = {
          ...orderItem,
          product: productInfo,
        };
        return orderItemFullData;
      }),
    );

    order.orderItems = mappedOrder;

    delete (order.user as any).password;
    return order;
  }

  async createAnOrder(
    userId: string,
    requestCreateOrderDto: RequestCreateOrderDto,
  ) {
    const cart = await this.cartService.getCartByUserId(userId);
    const cartResponse = await this.cartService.getCartResponseData(userId);
    const user: User = await this.userService.findOneById(userId);

    const mappedOrderItemsFromCart = cart.items.map((item) => {
      return {
        variation: item.variation,
        price: item.variation.salePrice || item.variation.unitPrice,
        quantity: item.quantity,
      };
    });

    const uid = new ShortUniqueId({ length: 10 });
    const orderCode = 'ORDER-' + uid.rnd();
    const orderData: CreateOrderDto = {
      user: userId,
      orderItems: mappedOrderItemsFromCart,
      orderStatus: [OrderStatus.PENDING],
      phoneNumber: requestCreateOrderDto.phoneNumber || user.phoneNumber,
      receiverName:
        requestCreateOrderDto.receiverName ||
        user.firstName + ' ' + user.lastName,
      shippingAddress: requestCreateOrderDto.shippingAddress || user.address,
      shippingFee: cartResponse.shippingFee,
      totalPrice: cartResponse.totalPrice,
      shippingFeePercentage: cartResponse.shippingFeePercentage,
      totalAmount: cartResponse.totalAmount,
      orderCode: orderCode,
      payment: {
        paymentMethod:
          requestCreateOrderDto.payment.paymentMethod ||
          PaymentMethod.CASH_ON_DELIVERY,
        paymentStatus: PaymentStatus.UNPAID,
      },
    };
    const orderResponse = await this.orderRepository.create(orderData);
    delete orderResponse.user.password;
    if (orderResponse) this.cartService.clearCart(userId);
    return orderResponse;
  }
  async updateOrder(
    userId: string,
    id: string,
    orderUpdateDto: UpdateOrderDto,
  ) {
    const order = await this.orderRepository.findByCondition({
      _id: id,
      user: userId,
    });

    if (!order) throw new NotFoundException('Order not found');

    if (orderUpdateDto.orderStatus) {
      order.orderStatus = [...order.orderStatus, orderUpdateDto.orderStatus];
    }
    if (orderUpdateDto.orderStatus === OrderStatus.DELIVERED) {
      order.payment.paymentStatus = PaymentStatus.PAID;
    }
    const responseOrderUpdate = await this.orderRepository.findByIdAndUpdate(
      id,
      order,
    );
    delete responseOrderUpdate.user;
    return responseOrderUpdate;
  }
  async updateOrderAdmin(id: string, orderUpdateDto: UpdateOrderDto) {
    const order = await this.orderRepository.findByCondition({
      _id: id,
    });

    if (!order) throw new NotFoundException('Order not found');

    if (orderUpdateDto.orderStatus) {
      order.orderStatus = [...order.orderStatus, orderUpdateDto.orderStatus];
    }
    const responseOrderUpdate = await this.orderRepository.findByIdAndUpdate(
      id,
      order,
    );
    delete responseOrderUpdate.user;
    return responseOrderUpdate;
  }
}
