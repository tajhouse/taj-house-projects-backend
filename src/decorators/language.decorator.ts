import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Language } from '../types/multilingual.types';

export const GetLanguage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest();

    // Check query parameter first
    const queryLang = request.query?.lang;
    if (queryLang && (queryLang === 'en' || queryLang === 'ar')) {
      return queryLang;
    }

    // Check Accept-Language header
    const acceptLanguage = request.headers['accept-language'];
    if (acceptLanguage) {
      // Parse Accept-Language header (e.g., "en-US,en;q=0.9,ar;q=0.8")
      const languages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().toLowerCase())
        .map(lang => lang.split('-')[0]); // Extract primary language

      // Find first supported language
      for (const lang of languages) {
        if (lang === 'en' || lang === 'ar') {
          return lang as Language;
        }
      }
    }

    // Default to English
    return 'en';
  },
);
