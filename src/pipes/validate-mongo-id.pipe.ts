import {
  ArgumentMetadata,
  BadRequestException,
  Param,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

class ValidateMongoIdPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${metadata.data} must be a valid MongoDB ObjectId`,
      );
    }

    return value;
  }
}

export const IdParam = (param = 'id'): ParameterDecorator =>
  Param(param, new ValidateMongoIdPipe());
