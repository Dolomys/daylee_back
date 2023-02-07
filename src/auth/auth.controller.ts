import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { GetUserAuthDto } from 'src/users/dto/response/get-user-auth.dto';
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
   login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
   register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
