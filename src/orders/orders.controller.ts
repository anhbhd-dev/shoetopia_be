import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ExtractUserFromRequest } from 'src/decorators/user.decorator';
import { User } from 'src/users/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestCreateOrderDto } from './dtos/create-order-dto';
import { Order } from './order.entity';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';

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
}
