export interface MultilingualField {
  en: string;
  ar: string;
}

export type Language = 'en' | 'ar';

export interface MultilingualProject {
  id: string;
  title: string;
  description: string;
  image: string;
  projectUrl?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    description: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MultilingualCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MultilingualCreateProjectDto {
  title: MultilingualField;
  description?: MultilingualField;
  image?: string;
  projectUrl?: string;
  categoryId: string;
  isActive?: boolean;
}

export interface MultilingualCreateCategoryDto {
  name: MultilingualField;
  description?: MultilingualField;
  isActive?: boolean;
}
