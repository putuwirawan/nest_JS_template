import {
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(params: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByLogin(params);

    if (!user) {
      return null;
    }
    return user;
  }
}
