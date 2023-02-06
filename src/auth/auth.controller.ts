import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { LoginUserDto } from 'src/users/dto/request/login-user.dto';
import { GetUserAuthDto } from 'src/users/dto/response/getUserAuth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGard } from './local-auth.gard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'login success',
    type: GetUserAuthDto,
  })
  @UseGuards(LocalAuthGard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
