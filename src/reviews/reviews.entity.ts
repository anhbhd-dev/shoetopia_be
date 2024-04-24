import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from 'src/users/users.entity';
import { Variation } from 'src/variations/variations.entity';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  rating: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Variation.name,
  })
  variation: Variation;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
