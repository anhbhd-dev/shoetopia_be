import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { FilterQuery } from 'mongoose';
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
    if (filter && filter['categories']) {
      queryFilter['category'] = { $in: filter['categories'] };
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
    sortBy?: string,
    order?: OrderBy,
  ): Promise<ProductsListResponse> {
    const queryFilter: FilterQuery<Product> = { isActive: true };
    if (filter && filter['name']) {
      queryFilter['name'] = { $regex: filter['name'], $options: 'i' };
    }
    if (filter && filter['categories']) {
      queryFilter['category'] = { $in: filter['categories'] };
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
  async countProducts(): Promise<number> {
    const result = await this.productRepository.aggregate([
      {
        $group: {
          _id: null,
          productsCount: { $sum: 1 }, // Đếm số
        },
      },
    ]);

    const productsCount = result.length > 0 ? result[0].productsCount : 0;
    return productsCount;
  }
  async filterProducts(
    page: number,
    pageSize: number,
    keywords = '',
    sortByDate?: 'asc' | 'desc',
    sortByPrice?: 'asc' | 'desc',
    categoryIds?: string[],
    minPrice?: number,
    maxPrice?: number,
    sizes?: string[],
  ): Promise<ProductsListResponse> {
    const aggregationPipeline: any[] = [];
    console.log(minPrice, maxPrice);
    // Lookup categories
    if (categoryIds && categoryIds.length > 0) {
      aggregationPipeline.push({
        $match: {
          category: {
            $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      });
    }

    // Lookup variations ((checked))
    aggregationPipeline.push({
      $lookup: {
        from: 'variations', // Collection name of variations
        localField: 'variations',
        foreignField: '_id',
        as: 'variations',
      },
    });

    // Filter by size (checked)
    if (sizes && sizes.length > 0) {
      aggregationPipeline.push({
        $match: {
          'variations.size': { $in: sizes },
        },
      });
    }

    // Filter by price range (checked)
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: any = {};
      if (minPrice !== undefined) {
        priceFilter.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        priceFilter.$lte = maxPrice;
      }

      aggregationPipeline.push({
        $match: {
          'variations.salePrice': priceFilter,
        },
      });
    }

    // mock data
    // const priceFilter: any = {};
    // priceFilter.$gte = 10000000;
    // aggregationPipeline.push({
    //   $match: {
    //     'variations.salePrice': priceFilter,
    //   },
    // });

    // Search by keywords// Search by keyword
    const keywordRegex = new RegExp(keywords, 'i');
    aggregationPipeline.push({
      $match: {
        $or: [
          { name: { $regex: keywordRegex } },
          { description: { $regex: keywordRegex } },
        ],
      },
    });

    // Count total documents
    const countPipeline = [...aggregationPipeline, { $count: 'totalDocs' }];
    const countResult = await this.productRepository.aggregate(countPipeline);
    const totalDocs = countResult.length > 0 ? countResult[0].totalDocs : 0;

    // Calculate pagination
    const totalPage = Math.ceil(totalDocs / pageSize);
    const skip = (page - 1) * pageSize;

    // Sort
    const sort: any = {};

    if (sortByDate === 'asc' || sortByDate === 'desc') {
      sort.createdAt = sortByDate === 'asc' ? 1 : -1;
    }
    if (sortByPrice === 'asc' || sortByPrice === 'desc') {
      sort['variations.salePrice'] = sortByPrice === 'asc' ? 1 : -1;
    }
    if (Object.keys(sort).length === 0) {
      sort.createdAt = 1;
    }
    aggregationPipeline.push({ $sort: sort });

    // Pagination
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: pageSize });

    // Execute aggregation
    const products =
      await this.productRepository.aggregate(aggregationPipeline);

    return { totalPage, totalDocs, products };
  }
}
