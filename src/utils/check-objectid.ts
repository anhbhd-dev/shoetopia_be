import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function checkIsObjectId(value: string, field: string) {
  if (!Types.ObjectId.isValid(value)) {
    throw new BadRequestException(`${field} must be a valid MongoDB ObjectId`);
  }
}
