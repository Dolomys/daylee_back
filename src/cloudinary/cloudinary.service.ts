import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadImage(file: MemoryStoredFile): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
}
