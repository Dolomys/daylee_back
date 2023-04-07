import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';
import toStream = require('buffer-to-stream');

// Using a function for ESM dynamic imports ( otherwhise compiling to require and crash --> https://stackoverflow.com/questions/70545129/compile-a-package-that-depends-on-esm-only-library-into-a-commonjs-package)
export const importDynamic = new Function('modulePath', 'return import(modulePath)');

@Injectable()
export class CloudinaryService {
  uploadFileAndGetUrl = (file: MemoryStoredFile) => this.uploadFile(file).then((data) => data);

  uploadManyFilesAndGetUrl = (files: Express.Multer.File[]) =>
    Promise.all(files.map((file) => this.uploadFile(file).then((data) => data.secure_url)));

  async uploadFile(file: Express.Multer.File | MemoryStoredFile): Promise<UploadApiResponse> {
    const { fileTypeFromBuffer } = await importDynamic('file-type');
    const fileType = await fileTypeFromBuffer(file.buffer);
    const ressourceType = fileType.mime.startsWith('video') ? 'video' : 'image';

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ resource_type: ressourceType, secure: true }, (error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  deleteFiles = (filesId: string[]) => Promise.all(filesId.map(file => this.deleteFile(file)))

  async deleteFile(fileId: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(fileId, (error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      });
    });
  }
}
