import { Injectable } from '@nestjs/common';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { PaymentMethod } from './payment-method.entity';
@Injectable()
export class PaymentMethodsService {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodsRepository,
  ) {}

  async findAll(page: number, limit: number): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.findAll(page, limit);
  }

  async findByName(name: string): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.findByCondition({ name });
  }

  async updateStatus(name: string, isEnabled: boolean): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.findByConditionAndUpdate(
      { name },
      { isEnabled },
    );
  }
}
