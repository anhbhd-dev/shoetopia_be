import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Category } from 'src/categories/categories.entity';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  unitPrice: number;

  @Prop()
  salePrice: number;

  @Prop()
  isHot?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  @Type(() => Category)
  category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
