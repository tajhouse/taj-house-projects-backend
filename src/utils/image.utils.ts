import sharp from 'sharp';
import { unlink } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';

export async function compressImage(filePath: string): Promise<void> {
  // Create a temporary file path for compression
  const dir = dirname(filePath);
  const name = basename(filePath, extname(filePath));
  const ext = extname(filePath);
  const tempPath = join(dir, `${name}_temp${ext}`);

  try {
    // Compress to temporary file
    await sharp(filePath)
      .resize(800)
      .jpeg({ quality: 80 })
      .toFile(tempPath);

    // Replace original with compressed version
    await unlink(filePath);

    // Rename temp file to original name
    const { rename } = await import('fs/promises');
    await rename(tempPath, filePath);

  } catch (error) {
    // Clean up temp file if it exists
    try {
      await unlink(tempPath);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    throw error;
  }
}
