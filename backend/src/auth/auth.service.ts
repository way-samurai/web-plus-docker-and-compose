import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({ where: { username } });

    if (user && user.password) {
      const isVerify = await this.hashService.verify(password, user.password);
      if (isVerify) {
        return user;
      } else {
        return null;
      }
    }
  }
}
