import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/utils/dto/request/create-user.dto';
import { LoginUserDto } from 'src/users/utils/dto/request/login-user.dto';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'SUCCESS',
    type: GetUserDtoLight,
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({
    description: 'SUCCESS',
    type: GetUserDtoLight,
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
