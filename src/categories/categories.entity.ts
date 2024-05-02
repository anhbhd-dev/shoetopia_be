import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Boolean, default: false })
  isShowAtHomePage?: boolean;

  @Prop()
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
