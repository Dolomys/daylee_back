import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { LoginUserDto } from 'src/users/dto/request/login-user.dto';
import { GetUserAuthDto } from 'src/users/dto/response/get-user-auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'login success',
    type: GetUserAuthDto,
  })
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiCreatedResponse({
    description: 'register success',
    type: GetUserAuthDto,
  })
  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
