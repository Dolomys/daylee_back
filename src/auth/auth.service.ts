import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
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
    if(!user)
      throw new NotFoundError('User not found')

    const validated = bcrypt.compareSync(pass, user.password)
    if (!validated) 
      throw new ConflictException('Wrong password')
    
    const { password, ...result } = user;
    return result;
   
  }

   login(user: any) {
    const payload = { username: user._doc.username, sub: user._doc._id };
    user.token = this.jwtService.sign(payload);
    return this.userMapper.toGetUserDto(user);
  }

   async register(user: User) {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(user.password, salt)
    user.password = hashedPass
    return this.usersService.createUser(user);
  }
}
