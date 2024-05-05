import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { Variation } from './variations.entity';
import { VariationsService } from './variations.service';
import { CreateVariationDto } from './dtos/create-variation.dto';
import { IdParam } from 'src/pipes/validate-mongo-id.pipe';
import { DeleteVariationDto } from './dtos/delete-variation.dto';
import { UpdateVariationDto } from './dtos/update-variation.dto';
@Controller('api/v1/variations')
export class VariationsController {
  constructor(private readonly variationService: VariationsService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
  ): Promise<Variation[]> {
    return this.variationService.findAll(+page, +limit, { name });
  }

  @Get(':id')
  async findOne(@IdParam('id') @Param('id') id: string): Promise<Variation> {
    return this.variationService.findOne(id);
  }

  @Get('all/names')
  async getAllVariationNames(): Promise<string[]> {
    return this.variationService.getDistinctVariationNames();
  }

  @Post()
  async create(
    @Body() variationCreateData: CreateVariationDto,
  ): Promise<Variation> {
    return this.variationService.create(variationCreateData);
  }

  @Put(':id')
  async update(
    @IdParam('id')
    @Param('id')
    id: string,
    @Body() variationUpdateData: UpdateVariationDto,
  ): Promise<Variation> {
    return this.variationService.update(id, variationUpdateData);
  }

  @Delete(':id')
  async remove(
    @IdParam('id') @Param('id') id: string,
    @Body() deleteVariationDto: DeleteVariationDto,
  ): Promise<void> {
    return this.variationService.remove(id, deleteVariationDto);
  }
}
