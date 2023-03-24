import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';
import toStream = require('buffer-to-stream');
import Ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class CloudinaryService {
  uploadFileAndGetUrl = (file: MemoryStoredFile) => this.uploadFile(file).then((data) => data.url);

  async uploadFile(file: MemoryStoredFile): Promise<UploadApiResponse> {
    const ressourceType = file.fileType.mime.startsWith('video') ? 'video' : 'image';
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ resource_type: ressourceType }, (error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
}
