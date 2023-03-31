import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {

  uploadFileAndGetUrl = (file: MemoryStoredFile) => this.uploadFile(file).then((data) => data.secure_url);

  uploadManyFilesAndGetUrl = (files: Express.Multer.File[]) =>
    Promise.all(files.map((file) => this.uploadFile(file).then((data) => data.secure_url)));

  async uploadFile(file: Express.Multer.File | MemoryStoredFile): Promise<UploadApiResponse> {
    const ressourceType =
      !file.mimetype ? 'image' : file.mimetype.startsWith('video') ? 'video' : 'image';

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ resource_type: ressourceType, secure: true }, (error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
