import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { SortBy } from 'src/types/sort-by.type';
import { OrderBy } from 'src/types/order-by.type';
import { ProductsListResponse } from './dtos/products-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/v1/admin/products')
@UseGuards(JwtAuthGuard)
export class ProductsAdminController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
    @Query('categories') categories?: string,
    @Query('sortBy') sortBy = SortBy.CREATED_AT,
    @Query('orderBy') orderBy = OrderBy.DESC,
  ): Promise<ProductsListResponse> {
    let filter: {
      name?: string;
      categories?: string[];
    } = name ? { name } : {};

    if (categories) {
      const categoriesArray = categories.split(',');
      filter = { ...filter, categories: categoriesArray };
    }

    return await this.productService.findAllAdmin(
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
