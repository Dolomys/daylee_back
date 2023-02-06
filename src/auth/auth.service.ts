import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user._doc.username, sub: user._doc._id };
    user.token = this.jwtService.sign(payload);
    return this.userMapper.toGetUserDto(user);
  }

  async register(user: User) {
    const result = await this.usersService.createUser(user);
    return result;
  }
}
