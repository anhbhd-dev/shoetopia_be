import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';

@Controller('api/v1/payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get(':name')
  async findByName(@Param('name') name: string) {
    return this.paymentMethodsService.findByName(name);
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paymentMethodsService.findAll(page, limit);
  }

  @Put()
  async updateForOne(@Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return this.paymentMethodsService.updateStatus(
      updatePaymentMethodDto.name,
      updatePaymentMethodDto.isEnabled,
    );
  }
}
