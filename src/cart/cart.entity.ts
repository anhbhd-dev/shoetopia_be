import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from 'src/users/users.entity';
import { Variation } from 'src/variations/variations.entity';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: ObjectId;

  @Prop([
    {
      variation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Variation.name,
        required: false,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ])
  items: Record<string, any>[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
