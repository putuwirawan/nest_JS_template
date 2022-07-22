import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/schema/user.schema';
import { userStub } from 'src/stubs/user.stub';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
jest.mock('./auth.service');
jest.mock('../users/users.service');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.dev.env', isGlobal: true }),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWTSECRETKEY,
          signOptions: { expiresIn: '600s' },
        }),
      ],
      providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);

     jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    let user: User;
    let login: LoginUserDto;
    login = new LoginUserDto();
    (login.email = 'testx@example.com'),
      (login.password = '123'),
      beforeEach(async () => {
        user = await authService.validateUser(login);
      });
    it('should call authService validateUser ', () => {

      expect(authService.validateUser).toBeDefined();
      expect(authService.validateUser).toHaveBeenCalled();
   
    });
    it('should call userService.findByLogin ', async () => {
      usersService.findByLogin(login);

      expect(usersService.findByLogin).toBeDefined();
      expect(usersService.findByLogin).toBeCalledWith(login);
    });

    it('should return a user object when credentials are valid', async () => {
      expect(authService.validateUser).toBeCalledWith(login);
      expect(user).toEqual(userStub());
    });
  });
});

// describe('validateUser', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const moduleRef: TestingModule = await Test.createTestingModule({
//       imports: [
//         UsersModule,
//         PassportModule,
//         JwtModule.register({
//           secret: jwtConstants.secret,
//           signOptions: { expiresIn: '60s' },
//         }),
//       ],
//       providers: [AuthService, LocalStrategy, JwtStrategy],
//     }).compile();

//     service = moduleRef.get<AuthService>(AuthService);
//   });

//   it('should return a user object when credentials are valid', async () => {
//     const res = await service.validateUser('maria', 'guess');
//     expect(res.userId).toEqual(3);
//   });

//   it('should return null when credentials are invalid', async () => {
//     const res = await service.validateUser('xxx', 'xxx');
//     expect(res).toBeNull();
//   });
// });

// describe('validateLogin', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const moduleRef: TestingModule = await Test.createTestingModule({
//       imports: [
//         UsersModule,
//         PassportModule,
//         JwtModule.register({
//           secret: jwtConstants.secret,
//           signOptions: { expiresIn: '60s' },
//         }),
//       ],
//       providers: [AuthService, LocalStrategy, JwtStrategy],
//     }).compile();

//     service = moduleRef.get<AuthService>(AuthService);
//   });

//   it('should return JWT object when credentials are valid', async () => {
//     const res = await service.login({ username: 'maria', userId: 3 });
//     expect(res.access_token).toBeDefined();
//   });
// });
