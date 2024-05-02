import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { Role } from 'src/constant/enum/role.enum';

@Schema({ timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: String, required: false })
  phoneNumber: string;

  @Prop({ type: String, required: false })
  avatar: string;

  @Prop()
  password: string;

  @Prop()
  roles: Role[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
