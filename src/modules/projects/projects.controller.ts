import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { multerConfig } from '../../config/multer.config';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { GetLanguage } from '../../decorators/language.decorator';
import type { Language } from '../../types/multilingual.types';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Project image is required');
    }

    const project = await this.projectsService.create(createProjectDto, image);
    return {
      success: true,
      message: 'Project created successfully',
      data: project,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto, image);
    return {
      success: true,
      message: 'Project updated successfully',
      data: project,
    };
  }

  @Get()
  async findAll(@GetLanguage() language: Language) {
    const projects = await this.projectsService.findAllWithLanguage(language);
    return {
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetLanguage() language: Language) {
    const project = await this.projectsService.findOneWithLanguage(id, language);
    return {
      success: true,
      message: 'Project fetched successfully',
      data: project,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(id);
    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), 'uploads', 'projects', filename);

    if (!existsSync(imagePath)) {
      throw new NotFoundException('Requested image not found');
    }

    return res.sendFile(imagePath);
  }
}