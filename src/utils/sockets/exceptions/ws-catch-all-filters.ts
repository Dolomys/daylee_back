import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { EventPatternChat } from 'src/chat/utils/const';
import { SocketWithAuth } from 'src/utils/types';
import {
  WsBadRequestException,
  WsNotFoundException,
  WsUnauthorizedException,
  WsUnknownException,
} from './ws-exceptions';

@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();
    let wsException: WsException;

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage = exceptionData['message'] ?? exceptionData ?? exception.name;
      wsException = new WsBadRequestException(exceptionMessage);
    }
    if (exception instanceof UnauthorizedException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage = exceptionData['message'] ?? exceptionData ?? exception.name;
      wsException = new WsUnauthorizedException(exceptionMessage);
    }
    if (exception instanceof NotFoundException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage = exceptionData['message'] ?? exceptionData ?? exception.name;
      wsException = new WsNotFoundException(exceptionMessage);
    } else {
      wsException = new WsUnknownException(exception.message);
    }

    socket.emit(EventPatternChat.listenExceptions, wsException.getError());
  }
}
