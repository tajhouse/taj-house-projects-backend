import { Language, MultilingualField } from '../types/multilingual.types';

export class MultilingualUtils {
  /**
   * Extract text for a specific language from a multilingual field
   */
  static extractText(multilingualField: MultilingualField, language: Language): string {
    return multilingualField[language] || multilingualField.en || '';
  }

  /**
   * Transform a multilingual object to a single-language object
   */
  static transformToSingleLanguage<T extends Record<string, any>>(
    obj: T,
    language: Language,
    multilingualFields: (keyof T)[]
  ): Partial<T> {
    const result: Partial<T> = { ...obj };

    for (const field of multilingualFields) {
      if (obj[field] && typeof obj[field] === 'object' && 'en' in obj[field] && 'ar' in obj[field]) {
        result[field] = this.extractText(obj[field] as MultilingualField, language) as any;
      }
    }

    return result;
  }

  /**
   * Transform nested objects with multilingual fields
   */
  static transformNestedMultilingual<T extends Record<string, any>>(
    obj: T,
    language: Language,
    multilingualFields: (keyof T)[],
    nestedMultilingualFields: Record<string, string[]> = {}
  ): Partial<T> {
    const result = this.transformToSingleLanguage(obj, language, multilingualFields);

    // Handle nested objects
    for (const [nestedField, nestedFields] of Object.entries(nestedMultilingualFields)) {
      if (result[nestedField] && typeof result[nestedField] === 'object') {
        (result as any)[nestedField] = this.transformToSingleLanguage(
          (result as any)[nestedField],
          language,
          nestedFields as any[]
        );
      }
    }

    return result;
  }

  /**
   * Validate multilingual field structure
   */
  static isValidMultilingualField(field: any): field is MultilingualField {
    return (
      field &&
      typeof field === 'object' &&
      typeof field.en === 'string' &&
      typeof field.ar === 'string'
    );
  }

  /**
   * Create multilingual field from single language input (for backward compatibility)
   */
  static createMultilingualField(text: string, language: Language = 'en'): MultilingualField {
    return {
      en: language === 'en' ? text : '',
      ar: language === 'ar' ? text : '',
    };
  }

  /**
   * Merge multilingual fields (useful for updates)
   */
  static mergeMultilingualFields(
    existing: MultilingualField,
    update: Partial<MultilingualField>
  ): MultilingualField {
    return {
      en: update.en !== undefined ? update.en : existing.en,
      ar: update.ar !== undefined ? update.ar : existing.ar,
    };
  }
}
