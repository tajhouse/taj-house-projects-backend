import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { compressImage } from 'src/utils/image.utils';
import { Language, MultilingualProject } from '../../types/multilingual.types';
import { MultilingualUtils } from '../../utils/multilingual.utils';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  async create(createProjectDto: CreateProjectDto, imageFile: Express.Multer.File): Promise<Project> {
    if (!imageFile) throw new BadRequestException('Project image is required');

    await compressImage(imageFile.path);

    const imagePath = `/uploads/projects/${imageFile.filename}`;

    const categoryExists = await this.categoryModel.findById(createProjectDto.categoryId);
    if (!categoryExists) {
      await unlink(imageFile.path);
      throw new BadRequestException('Specified category does not exist');
    }

    const projectData = { ...createProjectDto, image: imagePath };

    const createdProject = new this.projectModel(projectData);
    return createdProject.save();
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    imageFile?: Express.Multer.File,
  ): Promise<Project> {
    const existingProject = await this.projectModel.findById(id);
    if (!existingProject) throw new NotFoundException(`Project with id ${id} not found`);

    if (updateProjectDto.categoryId) {
      const categoryExists = await this.categoryModel.findById(updateProjectDto.categoryId);
      if (!categoryExists) {
        if (imageFile) await unlink(imageFile.path);
        throw new BadRequestException('Specified category does not exist');
      }
    }

    let updateData = { ...updateProjectDto };

    if (imageFile) {
      await compressImage(imageFile.path);

      if (existingProject.image) {
        try {
          const oldImagePath = join(process.cwd(), existingProject.image.startsWith('/') ? existingProject.image : `uploads/projects/${existingProject.image}`);
          await unlink(oldImagePath);
        } catch (err) {
          console.warn('Failed to delete old image:', err.message);
        }
      }

      updateData.image = `/uploads/projects/${imageFile.filename}`;
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('categoryId', 'name description')
      .lean<Project>()
      .exec();

    if (!updatedProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return updatedProject;
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel
      .find()
      .populate('categoryId', 'name description')
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findAllWithLanguage(language: Language): Promise<MultilingualProject[]> {
    const projects = await this.projectModel
      .find()
      .populate('categoryId', 'name description')
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();

    return projects.map(project => this.transformProjectToLanguage(project, language));
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel
      .findById(id)
      .populate('categoryId', 'name description')
      .exec();

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async findOneWithLanguage(id: string, language: Language): Promise<MultilingualProject> {
    const project = await this.projectModel
      .findById(id)
      .populate('categoryId', 'name description')
      .lean()
      .exec();

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return this.transformProjectToLanguage(project, language);
  }

  async remove(id: string): Promise<void> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    if (project.image) {
      try {
        const imagePath = join(process.cwd(), project.image.startsWith('/') ? project.image : `uploads/projects/${project.image}`);
        await unlink(imagePath);
        console.log('Project image deleted from system:', imagePath);
      } catch (error) {
        console.warn('Failed to delete project image:', error.message);
      }
    }

    await this.projectModel.findByIdAndDelete(id);
  }

  private transformProjectToLanguage(project: any, language: Language): MultilingualProject {
    const transformed = MultilingualUtils.transformNestedMultilingual(
      project,
      language,
      ['title', 'description'],
      { categoryId: ['name', 'description'] }
    );

    return {
      id: transformed._id?.toString() || transformed.id,
      title: transformed.title,
      description: transformed.description,
      image: transformed.image,
      projectUrl: transformed.projectUrl,
      categoryId: transformed.categoryId?._id?.toString() || transformed.categoryId?.toString(),
      category: transformed.categoryId ? {
        id: transformed.categoryId._id?.toString() || transformed.categoryId.toString(),
        name: transformed.categoryId.name,
        description: transformed.categoryId.description
      } : undefined,
      isActive: transformed.isActive,
      createdAt: transformed.createdAt,
      updatedAt: transformed.updatedAt
    };
  }
}