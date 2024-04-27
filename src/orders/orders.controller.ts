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

@Controller('api/v1/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @ExtractUserFromRequest() user: Partial<User>,
  ): Promise<Order[]> {
    return await this.ordersService.findAll(String(user._id), +page, +limit);
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
}
