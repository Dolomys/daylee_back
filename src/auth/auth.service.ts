import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserMapper } from 'src/users/user.mapper';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { CreateUserDto } from 'src/users/utils/dto/request/create-user.dto';
import { LoginUserDto } from 'src/users/utils/dto/request/login-user.dto';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';
import { UsersService } from '../users/users.service';
import { PayloadInterface } from './utils/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userMapper: UserMapper,
    private jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<UserDocument> {
    const user = await this.userRepository.findOneByUsername(loginUserDto.username);
    if (!user) throw new NotFoundException('User or Password incorrect');

    const validated = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!validated) throw new NotFoundException('User or Password incorrect');

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    const payload: PayloadInterface = { username: user.username, id: user.id };
    return {
      token: this.jwtService.sign(payload),
      user: this.userMapper.toGetUserDto(user),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<GetUserDtoLight> {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    return this.usersService.createUser(createUserDto as User);
  }
}
