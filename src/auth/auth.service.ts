import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserMapper } from 'src/users/user.mapper';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { CreateUserDto } from 'src/users/utils/dto/request/create-user.dto';
import { LoginUserDto } from 'src/users/utils/dto/request/login-user.dto';
import { PayloadType } from 'src/utils/types';
import { GetAuthDto } from './utils/dto/response/get-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userMapper: UserMapper,
    private jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<UserDocument> {
    const user = await this.userRepository.findOneByEmail(loginUserDto.email);
    if (!user) throw new NotFoundException('User or Password incorrect');

    const validated = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!validated) throw new NotFoundException('User or Password incorrect');

    return user;
  }

  private getToken(user: UserDocument) {
    const payload: PayloadType = { username: user.username, id: user.id };
    return this.jwtService.sign(payload);
  }

  async login(loginUserDto: LoginUserDto): Promise<GetAuthDto> {
    const user = await this.validateUser(loginUserDto);
    return {
      token: this.getToken(user),
      user: this.userMapper.toGetUserLightDto(user),
    } as GetAuthDto;
  }

  async register(createUserDto: CreateUserDto): Promise<GetAuthDto> {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.userRepository.createOne(createUserDto as User);
    return {
      token: this.getToken(newUser),
      user: this.userMapper.toGetUserLightDto(newUser),
    } as GetAuthDto;
  }
}
