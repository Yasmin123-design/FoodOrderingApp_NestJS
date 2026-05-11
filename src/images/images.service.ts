import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class ImagesService {
  async handleUpload(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      });

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(imageUrl: string) {
    try {
      // Extract public_id from URL (Cloudinary specific)
      // Example: https://res.cloudinary.com/demo/image/upload/v12345678/sample.jpg
      const splitUrl = imageUrl.split('/');
      const filename = splitUrl[splitUrl.length - 1];
      const publicId = filename.split('.')[0];
      
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }

  // Helper for backward compatibility (can be removed if not needed)
  getLocalPath(filename: string): string {
    return '';
  }
}
