import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/request/login-user.dto';
import { UserMapper } from 'src/users/user.mapper';
import { User } from 'src/users/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userMapper: UserMapper,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByUsername(loginUserDto.username);
    if (!user) throw new NotFoundException('User or Password incorrect');

    const validated = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!validated) throw new NotFoundException('User or Password incorrect');

    const { password, ...result } = user;
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    const payload = { username: user._doc.username, id: user._doc._id };
    user.token = this.jwtService.sign(payload);
    return this.userMapper.toGetUserDto(user);
  }

  async register(user: User) {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(user.password, salt);
    user.password = hashedPass;
    return this.usersService.createUser(user);
  }
}
