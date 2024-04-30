import { Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentMethodDocument } from './payment-method.entity';
import { BaseRepository } from 'src/abstract/generic-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentMethodsRepository extends BaseRepository<PaymentMethodDocument> {
  constructor(
    @InjectModel(PaymentMethod.name)
    private readonly PaymentMethodModel: Model<PaymentMethodDocument>,
  ) {
    super(PaymentMethodModel);
  }
}
