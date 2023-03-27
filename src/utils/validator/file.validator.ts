// custom-file-type-validator.ts
import { FileValidator } from '@nestjs/common';

export class CustomFilesTypeValidator extends FileValidator {
  private allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'video/mp4'];

  isValid(files: Express.Multer.File[]): boolean {
    return files.every((file) => this.allowedMimeTypes.includes(file.mimetype));
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `Invalid file type. Allowed types are: ${this.allowedMimeTypes.join(', ')}`;
  }
}
