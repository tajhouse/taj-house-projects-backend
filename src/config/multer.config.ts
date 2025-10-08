import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(process.cwd(), 'uploads', 'projects');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        `project-${uniqueSuffix}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`,
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(
        new BadRequestException(
          'Only image files (jpg, jpeg, png, gif, webp,avif) are allowed.',
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
  },
};
