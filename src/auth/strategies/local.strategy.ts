import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from '../../schema/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
    // default field username. for costom field add super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({
      email: email,
      password: password,
    });

    if (!user) {
      throw new UnauthorizedException('invalid username or  password');
    }
    return user;
  }
}
