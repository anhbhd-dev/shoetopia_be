import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { CreateVariationDto } from './dtos/create-variation.dto';
import { DeleteVariationDto } from './dtos/delete-variation.dto';
import { Variation } from './variations.entity';
import { VariationsRepository } from './variations.repository';
import { UpdateVariationDto } from './dtos/update-variation.dto';

@Injectable()
export class VariationsService {
  constructor(
    private readonly variationRepository: VariationsRepository,
    private readonly productService: ProductsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: FilterQuery<Variation>,
  ): Promise<Variation[]> {
    const queryFilter: FilterQuery<Variation> = {};

    if (filter?.name) {
      queryFilter['name'] = {
        $regex: filter['name'] ?? '',
        $options: 'i',
      };
    }
    return await this.variationRepository.findAll(page, limit, queryFilter);
  }

  async findOne(id: string): Promise<Variation> {
    const existingVariation = await this.variationRepository.findById(id);
    if (!existingVariation) {
      throw new NotFoundException(`Variation with id ${id} not found`);
    }
    return existingVariation;
  }

  async create(createVariation: CreateVariationDto): Promise<Variation> {
    const product = await this.productService.findOne(
      createVariation.productId,
    );
    if (product) {
      const variationRes =
        await this.variationRepository.create(createVariation);

      const updatedVariation = product.variations;
      updatedVariation.push(variationRes);
      await this.productService.update(createVariation.productId, {
        variations: updatedVariation,
      });
      return await variationRes;
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateVariationDto,
  ): Promise<Variation> {
    const existingCategory = await this.findOne(id);
    if (!existingCategory) {
      throw new NotFoundException(`Variation with id ${id} not found`);
    }
    return await this.variationRepository.findByIdAndUpdate(
      existingCategory._id,
      updateCategoryDto,
    );
  }

  async remove(
    id: string,
    deleteVariationDto: DeleteVariationDto,
  ): Promise<void> {
    const existingVariation = await this.findOne(id);
    if (!existingVariation) {
      throw new NotFoundException(`Variation with id ${id} not found`);
    }
    const product = await this.productService.findOne(
      deleteVariationDto.productId,
    );
    const updatedVariations = product.variations.filter(
      (variation) => variation._id.toString() !== id,
    );

    await this.productService.update(deleteVariationDto.productId, {
      variations: updatedVariations,
    });
    await this.variationRepository.deleteOne(id);
  }
}
