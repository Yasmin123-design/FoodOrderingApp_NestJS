import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ImagesService {
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  async handleUpload(file: Express.Multer.File): Promise<string> {
    // Generate the public URL
    const publicUrl = `${this.baseUrl}/images/files/${file.filename}`;
    return publicUrl;
  }

  getLocalPath(filename: string): string {
    return join(process.cwd(), 'uploads', filename);
  }

  async deleteImage(imageUrl: string) {
    try {
      // Extract filename from URL
      const filename = imageUrl.split('/').pop();
      if (filename) {
        const filePath = this.getLocalPath(filename);
        await unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error if image delete fails, just log it
    }
  }
}
