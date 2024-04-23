import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Category } from 'src/categories/categories.entity';
import { Variation } from 'src/variations/variations.entity';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: false,
    default: false,
  })
  isHot?: boolean;

  @Prop({ type: [{ type: String }] })
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  @Type(() => Category)
  category: Category;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isActive?: boolean;
  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variation',
      required: false,
    },
  ])
  variations?: [Variation];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
