import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UploadCloudinaryPipe implements PipeTransform {
  constructor(private readonly CloudinaryService: CloudinaryService ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if(value) {
        const apiResponse = await this.CloudinaryService.uploadImage(value);
        return apiResponse.url
    }
  }
}
