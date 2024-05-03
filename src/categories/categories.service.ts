import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { OrderBy } from 'src/types/order-by.type';
import { Category } from './categories.entity';
import { CategoryRepository } from './categories.repository';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAllAdmin(
    page: number,
    limit: number,
    filter?: FilterQuery<Category>,
    sortBy?: string,
    order?: OrderBy,
  ): Promise<{ categories: Category[]; totalPage: number; totalDocs: number }> {
    const queryFilter: FilterQuery<Category> = {};
    if (filter && filter['name']) {
      queryFilter['name'] = { $regex: filter['name'], $options: 'i' };
    }

    const sortOption = order === OrderBy.ASC ? 'asc' : 'desc';

    const res = await this.categoryRepository.findAllWithFullFilters(
      page,
      limit,
      queryFilter,
      sortBy,
      sortOption,
    );

    return {
      categories: res.data,
      totalPage: res.totalPage,
      totalDocs: res.totalDocs,
    };
  }

  async findAll(
    page: number,
    limit: number,
    filter?: FilterQuery<Category>,
  ): Promise<Category[]> {
    const queryFilter: FilterQuery<Category> = {};

    if (filter) {
      queryFilter['name'] = {
        $regex: filter['name'] ?? '',
        $options: 'i',
      };
      if (filter['isShowAtHomePage']) {
        queryFilter['isShowAtHomePage'] = filter['isShowAtHomePage'];
      }
    }

    return await this.categoryRepository.findAll(page, limit, queryFilter);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.create(createCategoryDto);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.findOne(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return await this.categoryRepository.findByIdAndUpdate(
      existingCategory._id,
      updateCategoryDto,
    );
  }

  async remove(id: string): Promise<void> {
    const existingCategory = await this.findOne(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    await this.categoryRepository.deleteOne(id);
  }
}
