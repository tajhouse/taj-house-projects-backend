import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetLanguage } from '../../decorators/language.decorator';
import type { Language } from '../../types/multilingual.types';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      message: 'category has been added successfully ',
      data: category,
    };
  }

  @Get()
  async findAll(@GetLanguage() language: Language) {
    const categories = await this.categoriesService.findAllWithLanguage(language);
    return {
      success: true,
      message: 'All categories fetched successfully',
      data: categories,
    };
  }

  @Get('active')
  async findActive(@GetLanguage() language: Language) {
    const categories = await this.categoriesService.findActiveWithLanguage(language);
    return {
      success: true,
      message: 'Active categories fetched successfully',
      data: categories,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetLanguage() language: Language) {
    const category = await this.categoriesService.findOneWithLanguage(id, language);
    return {
      success: true,
      message: 'category fetched successfully',
      data: category,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return {
      success: true,
      message: 'category updated successfully',
      data: category,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return {
      success: true,
      message: 'category deleted successfully',
    };
  }
}