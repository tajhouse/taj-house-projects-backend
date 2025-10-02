import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Language, MultilingualCategory } from '../../types/multilingual.types';
import { MultilingualUtils } from '../../utils/multilingual.utils';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ order: 1, createdAt: -1 }).exec();
  }

  async findAllWithLanguage(language: Language): Promise<MultilingualCategory[]> {
    const categories = await this.categoryModel
      .find()
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();

    return categories.map(category => this.transformCategoryToLanguage(category, language));
  }

  async findActive(): Promise<Category[]> {
    return this.categoryModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  async findActiveWithLanguage(language: Language): Promise<MultilingualCategory[]> {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ order: 1 })
      .lean()
      .exec();

    return categories.map(category => this.transformCategoryToLanguage(category, language));
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`category ${id} not found`);
    }
    return category;
  }

  async findOneWithLanguage(id: string, language: Language): Promise<MultilingualCategory> {
    const category = await this.categoryModel
      .findById(id)
      .lean()
      .exec();

    if (!category) {
      throw new NotFoundException(`category ${id} not found`);
    }

    return this.transformCategoryToLanguage(category, language);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!existingCategory) {
      throw new NotFoundException(`category ${id} not found`);
    }
    return existingCategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`category ${id} not found`);
    }
  }

  private transformCategoryToLanguage(category: any, language: Language): MultilingualCategory {
    const transformed = MultilingualUtils.transformToSingleLanguage(
      category,
      language,
      ['name', 'description']
    );

    return {
      id: transformed._id?.toString() || transformed.id,
      name: transformed.name,
      description: transformed.description,
      isActive: transformed.isActive,
      createdAt: transformed.createdAt,
      updatedAt: transformed.updatedAt
    };
  }
}