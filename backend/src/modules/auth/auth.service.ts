import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);
    const payload = {
      id: user.id,
      username: user.name,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(authLoginDto: AuthLoginDto) {
    const { email, password } = authLoginDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
