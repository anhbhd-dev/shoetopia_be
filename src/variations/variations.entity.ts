import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Product } from 'src/products/product.entity';

export type VariationDocument = Variation & Document;

@Schema({ timestamps: true })
export class Variation {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  size: string;

  @Prop()
  availableQuantity: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;
}

export const VariationSchema = SchemaFactory.createForClass(Variation);
