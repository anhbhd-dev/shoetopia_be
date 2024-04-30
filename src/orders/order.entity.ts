import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from 'src/constant/enum/order.enum';
import { User } from 'src/users/users.entity';
import { Variation } from 'src/variations/variations.entity';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: String, enum: PaymentMethod })
  paymentMethod: string;

  @Prop({ type: String, enum: PaymentStatus })
  paymentStatus: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: ObjectId;

  @Prop({ type: String, required: true })
  orderCode: string;

  @Prop({ type: String, required: true })
  shippingAddress: string;

  @Prop({ type: String, required: true })
  receiverName: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop([
    {
      variation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Variation.name,
        required: false,
      },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ])
  orderItems: Record<string, any>[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, required: true })
  shippingFee: number;

  @Prop({ type: Number, required: true })
  shippingFeePercentage: number;

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: [String], enum: OrderStatus, required: true })
  orderStatus: OrderStatus[];

  @Prop({ type: PaymentSchema })
  payment: Payment;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
