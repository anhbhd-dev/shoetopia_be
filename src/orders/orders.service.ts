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

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly userService: UsersService,
  ) {}

  async findAll(userId: string, page: number, limit: number) {
    const userOrders = await this.orderRepository.findAll(page, limit, {
      user: userId,
    });
    const userOrdersResponse = userOrders.map((order) => {
      delete order.user;
      return order;
    });
    return userOrdersResponse;
  }
  async getOrderById(userId: string, orderId: string) {
    const order = await this.orderRepository.findById(orderId);

    if (!order || (order as any).user._id.toString() !== userId)
      throw new NotFoundException('Order not found');
    const orderDataResponse = order;
    delete orderDataResponse.user;
    return orderDataResponse;
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

    if (orderUpdateDto.status) {
      order.orderStatus = [...order.orderStatus, orderUpdateDto.status];
    }
    return await this.orderRepository.findByIdAndUpdate(id, orderUpdateDto);
  }
}
