import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/abstract/generic-repository';
import { Variation, VariationDocument } from './variations.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VariationsRepository extends BaseRepository<VariationDocument> {
  constructor(
    @InjectModel(Variation.name)
    private variationModel: Model<VariationDocument>,
  ) {
    super(variationModel);
  }
}
