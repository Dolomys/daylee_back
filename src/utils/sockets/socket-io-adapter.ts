import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'https';
import { Server } from 'socket.io';
import { SocketWithAuth } from 'src/utils/types';

export class SocketIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: ['*'],
    };
    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, { ...options, cors });
    server.of('chat').use(createTokenMiddelware(jwtService));
    return server;
  }
}

const createTokenMiddelware = (jwtService: JwtService) => (socket: SocketWithAuth, next) => {
  //TODO remove hanhshake headers --> for postman test only
  const token = socket.handshake.auth.token || socket.handshake.headers['token'];
  try {
    const payload = jwtService.verify(token);
    socket.username = payload.username;
    socket.id = payload.id;
    next();
  } catch {
    next(new Error('FORBIDDEN'));
  }
};
