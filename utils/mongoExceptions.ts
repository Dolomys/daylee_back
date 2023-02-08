import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let error;

    switch (exception.code) {
      case 11000:
        error = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Duplicate error',
        };
        break;
      default: {
        error = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: exception.errmsg,
        };
        break;
      }
    }

    response.status(error.statusCode).json(error);
  }
}
