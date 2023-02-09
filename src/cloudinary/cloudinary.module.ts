import { Module } from '@nestjs/common';
import { UploadCloudinaryPipe } from './cloudinary.pipe';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, UploadCloudinaryPipe],
  exports: [CloudinaryProvider, CloudinaryService, UploadCloudinaryPipe],
})
export class CloudinaryModule {}
