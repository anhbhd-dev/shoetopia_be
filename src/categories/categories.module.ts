import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesAdminController } from './categories.admin.controller';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './categories.entity';
import { CategoryRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService, CategoryRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
