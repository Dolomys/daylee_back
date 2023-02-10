import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateSearchPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // No query made
    if(!value) 
        return 

    if (value.length < 3)
        throw new BadRequestException('Search must have at least 3 characteres')
    
    return value;
  }
}