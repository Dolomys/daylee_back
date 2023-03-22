import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserMapper } from 'src/users/user.mapper';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { CreateUserDto } from 'src/users/utils/dto/request/create-user.dto';
import { LoginUserDto } from 'src/users/utils/dto/request/login-user.dto';
import { PayloadType } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
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

  private getToken(user: UserDocument) {
    const payload:PayloadType = { username: user.username, id: user.id }
    return this.jwtService.sign(payload)
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    return {
      token: this.getToken(user),
      user: this.userMapper.toGetUserDto(user),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.userRepository.createOne(createUserDto as User)
    return {
      token: this.getToken(newUser),
      user: this.userMapper.toGetUserDto(newUser),
    }
  }
}
