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
import { OrderBy } from 'src/types/order-by.type';
import { SortBy } from 'src/types/sort-by.type';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('/api/v1/admin/categories')
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
    @Query('sortBy') sortBy = SortBy.CREATED_AT,
    @Query('orderBy') orderBy = OrderBy.DESC,
  ): Promise<{ categories: Category[]; totalPage: number; totalDocs: number }> {
    const filter = name ? { name } : {};

    return await this.categoriesService.findAllAdmin(
      +page,
      +limit,
      filter,
      sortBy,
      orderBy,
    );
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  async update(
    @IdParam('id')
    @Param('id')
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }
  @Delete(':id')
  async remove(@IdParam('id') @Param('id') id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
