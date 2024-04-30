import { Module } from '@nestjs/common';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethod, PaymentMethodSchema } from './payment-method.entity';
import { PaymentMethodsRepository } from './payment-methods.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
    ]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, PaymentMethodsRepository],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
