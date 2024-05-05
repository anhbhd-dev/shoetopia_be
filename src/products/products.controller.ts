import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductsListResponse } from './dtos/products-response.dto';
import { OrderBy } from 'src/types/order-by.type';
import { SortBy } from 'src/types/sort-by.type';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 9,
    @Query('name') name?: string,
    @Query('categories') categories?: string,
    @Query('isHot') isHot?: boolean,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy = SortBy.CREATED_AT,
    @Query('orderBy') orderBy = OrderBy.DESC,
  ): Promise<ProductsListResponse> {
    let filter: {
      name?: string;
      categories?: string[];
      minPrice?: number;
      maxPrice?: number;
      isHot?: boolean;
    } = name ? { name } : {};

    if (categories) {
      const categoriesArray = categories.split(',');
      filter = { ...filter, categories: categoriesArray };
    }
    if (isHot) {
      filter = { ...filter, isHot: true };
    }
    if (minPrice) {
      filter['minPrice'] = minPrice;
    }
    if (maxPrice) {
      filter['maxPrice'] = maxPrice;
    }

    return await this.productService.findAll(
      +page,
      +limit,
      filter,
      sortBy,
      orderBy,
    );
  }

  @Get(':id')
  async findOne(@IdParam('id') @Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  async create(@Body() productData: CreateProductDto): Promise<Product> {
    console.log(productData);
    return this.productService.create(productData);
  }

  @Put(':id')
  async update(
    @IdParam('id')
    @Param('id')
    id: string,
    @Body() productData: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, productData);
  }

  @Delete(':id')
  async remove(@IdParam('id') @Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
