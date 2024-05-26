import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/decorators/user.decorator';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';
import { User } from 'src/users/users.entity';
import { RequestCreateOrderDto } from './dtos/create-order-dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { SortBy } from 'src/types/sort-by.type';
import { OrderBy } from 'src/types/order-by.type';
import { OrderStatus } from 'src/constant/enum/order.enum';
import { OrdersListResponse } from './dtos/orders-response';

@Controller('api/v1/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('sortBy') sortBy = SortBy.CREATED_AT,
    @Query('orderBy') orderBy = OrderBy.DESC,
    @ExtractUserFromRequest() user: Partial<User>,
    @Query('orderStatus') orderStatus?: OrderStatus,
  ): Promise<OrdersListResponse> {
    const filter = {};
    if (orderStatus) filter['orderStatus'] = orderStatus;
    return await this.ordersService.findAll(
      user,
      page,
      limit,
      filter,
      sortBy,
      orderBy,
    );
  }

  @Get(':orderId')
  async findOneOrder(
    @ExtractUserFromRequest() user: Partial<User>,
    @IdParam('orderId') @Param('orderId') orderId: string,
  ): Promise<Order> {
    return await this.ordersService.getOrderById(String(user._id), orderId);
  }

  @Post('create')
  async createOrder(
    @ExtractUserFromRequest() user: Partial<User>,
    @Body() requestCreateOrderDto: RequestCreateOrderDto,
  ) {
    return await this.ordersService.createAnOrder(
      String(user._id),
      requestCreateOrderDto,
    );
  }

  @Put(':orderId')
  async updateOrder(
    @ExtractUserFromRequest() user: Partial<User>,
    @IdParam('orderId') @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.updateOrder(
      String(user._id),
      orderId,
      updateOrderDto,
    );
  }
  @Put('order-code/:orderCode')
  async updateOrderByCode(
    @ExtractUserFromRequest() user: Partial<User>,
    @Param('orderCode') orderCode: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    console.log(updateOrderDto);
    return await this.ordersService.updateOrderByCode(
      String(user._id),
      orderCode,
      updateOrderDto,
    );
  }
}
