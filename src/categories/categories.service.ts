import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
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
