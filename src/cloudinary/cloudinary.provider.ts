import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: async (configService: ConfigService) => {
    return v2.config({
      cloud_name: configService.get('CLOUDINARY.NAME'),
      api_key: configService.get('CLOUDINARY.KEY'),
      api_secret: configService.get('CLOUDINARY.SECRET'),
    });
  },
  inject: [ConfigService],
};
