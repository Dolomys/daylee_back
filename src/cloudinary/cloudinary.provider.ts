
import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'dhl6bbmhb',
      api_key: '944161134181937',
      api_secret: '-R8go378CswcnQbjnrSKAnzD1Yk',
    });
  },
};