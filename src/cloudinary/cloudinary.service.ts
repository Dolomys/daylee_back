import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  isExpressOrMemoryFile(toBeDetermined: Express.Multer.File | MemoryStoredFile): toBeDetermined is MemoryStoredFile {
    if ((toBeDetermined as MemoryStoredFile).fileType) {
      return true;
    }
    return false;
  }

  uploadFileAndGetUrl = (file: MemoryStoredFile) => this.uploadFile(file).then((data) => data.secure_url);

  uploadManyFilesAndGetUrl = (files: Express.Multer.File[]) =>
    Promise.all(files.map((file) => this.uploadFile(file).then((data) => data.secure_url)));

  async uploadFile(file: Express.Multer.File | MemoryStoredFile): Promise<UploadApiResponse> {
    const isMemoryStoredFile = this.isExpressOrMemoryFile(file);
    const ressourceType = isMemoryStoredFile
      ? file.fileType.mime.startsWith('video')
        ? 'video'
        : 'image'
      : file.mimetype.startsWith('video')
      ? 'video'
      : 'image';

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ resource_type: ressourceType, secure: true }, (error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
