# Multilingual Support Implementation

This document describes the multilingual support implementation for the TAJ House Dashboard project, supporting English and Arabic languages.

## Overview

The implementation adds multilingual support to both `projects` and `categories` collections, allowing content to be stored and retrieved in both English and Arabic.

## Key Features

- **Language Detection**: Automatic language detection from `Accept-Language` header or `?lang=` query parameter
- **Default Language**: Falls back to English if no language is specified
- **Translatable Fields**: `name`, `title`, and `description` fields support both languages
- **API Response**: Returns only the requested language content
- **Backward Compatibility**: Existing data can be migrated using the provided migration script

## Database Schema Changes

### Before (Single Language)

```javascript
{
  name: "E-commerce Website",
  description: "A full-stack e-commerce platform"
}
```

### After (Multilingual)

```javascript
{
  name: {
    en: "E-commerce Website",
    ar: "موقع تجارة إلكترونية"
  },
  description: {
    en: "A full-stack e-commerce platform",
    ar: "منصة تجارة إلكترونية متكاملة"
  }
}
```

## API Usage

### Language Selection

The API supports language selection through:

1. **Accept-Language Header** (Priority 1):

   ```
   Accept-Language: ar-SA,ar;q=0.9,en;q=0.8
   ```

2. **Query Parameter** (Priority 2):

   ```
   GET /projects?lang=ar
   GET /categories?lang=ar
   ```

3. **Default** (Fallback):
   If neither is provided, defaults to English (`en`)

### Example API Calls

#### Get Projects in Arabic

```bash
curl -H "Accept-Language: ar" http://localhost:3000/projects
# OR
curl http://localhost:3000/projects?lang=ar
```

#### Get Categories in English (default)

```bash
curl http://localhost:3000/categories
# OR
curl http://localhost:3000/categories?lang=en
```

### Example Responses

#### English Response

```json
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "E-commerce Website",
      "description": "A full-stack e-commerce platform",
      "category": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Technology",
        "description": "Technology related projects"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Arabic Response

```json
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "موقع تجارة إلكترونية",
      "description": "منصة تجارة إلكترونية متكاملة",
      "category": {
        "id": "507f1f77bcf86cd799439012",
        "name": "تكنولوجيا",
        "description": "مشاريع متعلقة بالتكنولوجيا"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Creating Multilingual Content

### Creating a Project

```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": {
      "en": "E-commerce Website",
      "ar": "موقع تجارة إلكترونية"
    },
    "description": {
      "en": "A full-stack e-commerce platform",
      "ar": "منصة تجارة إلكترونية متكاملة"
    },
    "categoryId": "507f1f77bcf86cd799439012"
  }'
```

### Creating a Category

```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "en": "Technology",
      "ar": "تكنولوجيا"
    },
    "description": {
      "en": "Technology related projects",
      "ar": "مشاريع متعلقة بالتكنولوجيا"
    }
  }'
```

## Migration from Existing Data

If you have existing single-language data, use the migration script:

```bash
# Install mongodb driver if not already installed
npm install mongodb

# Run migration script
node scripts/migrate-to-multilingual.js
```

The migration script will:

1. Convert existing `name`/`title` fields to multilingual format
2. Convert existing `description` fields to multilingual format
3. Copy the original value to both `en` and `ar` fields
4. Preserve all other data unchanged

## File Structure

```
src/
├── types/
│   └── multilingual.types.ts          # Type definitions
├── decorators/
│   └── language.decorator.ts          # Language extraction decorator
├── utils/
│   └── multilingual.utils.ts          # Utility functions
├── dto/
│   └── multilingual-field.dto.ts      # Validation DTO
├── modules/
│   ├── projects/
│   │   ├── schemas/project.schema.ts  # Updated schema
│   │   ├── dto/create-project.dto.ts  # Updated DTOs
│   │   ├── projects.service.ts        # Updated service
│   │   └── projects.controller.ts     # Updated controller
│   └── categories/
│       ├── schemas/category.schema.ts # Updated schema
│       ├── dto/create-category.dto.ts # Updated DTOs
│       ├── categories.service.ts      # Updated service
│       └── categories.controller.ts   # Updated controller
└── scripts/
    └── migrate-to-multilingual.js     # Migration script
```

## Key Components

### 1. Language Decorator (`GetLanguage`)

Extracts language preference from request headers or query parameters.

### 2. Multilingual Utils (`MultilingualUtils`)

Utility functions for transforming multilingual data to single-language responses.

### 3. Updated Schemas

Mongoose schemas now support nested multilingual fields with proper validation.

### 4. Updated Services

Services include new methods for language-specific data retrieval:

- `findAllWithLanguage(language)`
- `findOneWithLanguage(id, language)`
- `findActiveWithLanguage(language)` (for categories)

### 5. Updated Controllers

Controllers automatically extract language and return localized responses.

## Validation

The implementation includes proper validation for multilingual fields:

```typescript
@IsObject()
@ValidateNested()
@Type(() => MultilingualFieldDto)
title: MultilingualField;
```

This ensures that both `en` and `ar` fields are provided and are non-empty strings.

## Error Handling

The system gracefully handles:

- Missing language specifications (defaults to English)
- Invalid language codes (defaults to English)
- Missing translations (falls back to English content)

## Performance Considerations

- Uses MongoDB indexes on multilingual fields for efficient searching
- Implements lean queries where possible to reduce memory usage
- Caches language extraction logic in decorator

## Future Enhancements

Potential future improvements:

1. **Admin Interface**: Add admin interface for managing translations
2. **Translation Management**: Add endpoints for updating individual language fields
3. **Additional Languages**: Extend support for more languages
4. **Translation Validation**: Add validation for translation completeness
5. **Search Enhancement**: Implement cross-language search capabilities
