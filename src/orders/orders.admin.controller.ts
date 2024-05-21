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
import { OrdersListResponse } from './dtos/orders-response';
import { SortBy } from 'src/types/sort-by.type';
import { OrderBy } from 'src/types/order-by.type';
import { OrderStatus } from 'src/constant/enum/order.enum';

@Controller('api/v1/admin/orders')
@UseGuards(JwtAuthGuard)
export class OrdersAdminController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderCode') orderCode?: string,
    @Query('sortBy') sortBy = SortBy.CREATED_AT,
    @Query('orderBy') orderBy = OrderBy.DESC,
    @Query('orderStatus') orderStatus?: OrderStatus,
  ): Promise<OrdersListResponse> {
    const filter = orderCode ? { orderCode } : {};
    if (orderStatus) filter['orderStatus'] = orderStatus;

    return await this.ordersService.findAllAdmin(
      +page,
      +limit,
      filter,
      sortBy,
      orderBy,
    );
  }

  @Get(':orderId')
  async findOneOrder(
    @IdParam('orderId') @Param('orderId') orderId: string,
  ): Promise<Order> {
    return await this.ordersService.getOrderByIdAdmin(orderId);
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
    @IdParam('orderId') @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.updateOrderAdmin(orderId, updateOrderDto);
  }

  @Get('statistics/total-revenue')
  async getStatistics() {
    return await this.ordersService.getTotalAmountBetweenDates();
  }
  @Get('statistics/order-today')
  async getTotalOrderToday() {
    return await this.ordersService.getOrdersCountToday();
  }
  @Get('statistics/items-sale')
  async getItemsSale() {
    return await this.ordersService.getVariationSalesBetweenDates();
  }
}
