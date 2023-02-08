import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/request/login-user.dto';
import { GetUserDto } from 'src/users/dto/response/get-user-auth.dto';
import { UserMapper } from 'src/users/user.mapper';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersService } from '../users/users.service';
import { PayloadInterface } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userMapper: UserMapper,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<UserDocument> {
    const user = await this.usersService.findByUsername(loginUserDto.username);
    if (!user) throw new NotFoundException('User or Password incorrect');

    const validated = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!validated) throw new NotFoundException('User or Password incorrect');

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    const payload : PayloadInterface = { username: user.username, id: user.id };
    return {
    token: this.jwtService.sign(payload),
    user: this.userMapper.toGetUserDto(user)}
  }

  async register(user: User): Promise<GetUserDto> {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(user.password, salt);
    user.password = hashedPass;
    return this.usersService.createUser(user);
  }
}
