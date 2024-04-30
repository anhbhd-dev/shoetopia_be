import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './products.repository';
import { OrderBy } from 'src/types/order-by.type';
import { ProductsListResponse } from './dtos/products-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoriesService,
  ) {}

  async findAllAdmin(
    page: number,
    limit: number,
    filter?: FilterQuery<Product>,
    sortBy?: string,
    order?: OrderBy,
  ): Promise<ProductsListResponse> {
    const queryFilter: FilterQuery<Product> = {};
    if (filter && filter['name']) {
      queryFilter['name'] = { $regex: filter['name'], $options: 'i' };
    }

    const sortOption = order === OrderBy.ASC ? 'asc' : 'desc';

    const res = await this.productRepository.findAllWithFullFilters(
      page,
      limit,
      queryFilter,
      sortBy,
      sortOption,
    );

    return {
      products: res.data,
      totalPage: res.totalPage,
      totalDocs: res.totalDocs,
    };
  }

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
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async findOneByCondition(condition: FilterQuery<Product>): Promise<Product> {
    const product = await this.productRepository.findByCondition(condition);
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    if (category)
      return await this.productRepository.create({
        ...createProductDto,
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
