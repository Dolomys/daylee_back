import { ApiProperty } from '@nestjs/swagger';
import { WsException } from '@nestjs/websockets';

enum WsExceptionTypeEnum {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN = 'UNKNOWN',
  NOT_FOUND = 'NOT_FOUND'
}

export class ErrorDto {
  @ApiProperty({ enum: WsExceptionTypeEnum })
  type: WsExceptionTypeEnum;

  @ApiProperty()
  message: String;
}

export class WsTypeException extends WsException {
  type: WsExceptionTypeEnum;

  constructor(type: WsExceptionTypeEnum, message: string) {
    const error: ErrorDto = {
      type,
      message,
    };
    super(error);
    this.type = type;
  }
}

export class WsBadRequestException extends WsTypeException {
  constructor(message: string) {
    super(WsExceptionTypeEnum.BAD_REQUEST, message);
  }
}
export class WsNotFoundException extends WsTypeException {
  constructor(message: string) {
    super(WsExceptionTypeEnum.NOT_FOUND, message);
  }
}

export class WsUnauthorizedException extends WsTypeException {
  constructor(message: string) {
    super(WsExceptionTypeEnum.UNAUTHORIZED, message);
  }
}

export class WsUnknownException extends WsTypeException {
  constructor(message: string) {
    super(WsExceptionTypeEnum.UNKNOWN, message);
  }
}
