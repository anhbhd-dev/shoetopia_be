import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { Product } from './product.entity';
import { FilterQuery } from 'mongoose';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoriesService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: FilterQuery<Product>,
  ): Promise<Product[]> {
    const queryFilter: FilterQuery<Product> = {};

    if (filter) {
      queryFilter['name'] = {
        $regex: filter['name'] ?? '',
        $options: 'i',
      };
    }
    return await this.productRepository.findAll(page, limit, queryFilter);
  }

  async findOne(id: string): Promise<Product> {
    const category = await this.productRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryService.findOne(
      createCategoryDto.categoryId,
    );
    if (category)
      return await this.productRepository.create({
        ...createCategoryDto,
        category,
      });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    let updateProductData: any = updateProductDto;
    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );
      if (category)
        updateProductData = {
          ...updateProductData,
          category,
        };
    }

    return await this.productRepository.findByIdAndUpdate(
      existingProduct._id,
      updateProductData,
    );
  }

  async remove(id: string): Promise<void> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.deleteOne(id);
  }
}
