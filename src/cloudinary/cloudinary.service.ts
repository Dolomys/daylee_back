import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()

export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) 
            throw new BadRequestException('Wrong file format')
        if (result)
            resolve(result);
      });
    
      toStream(file.buffer).pipe(upload);
    });
  }
}