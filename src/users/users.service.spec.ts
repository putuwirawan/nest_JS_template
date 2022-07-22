import { HttpException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { async } from 'rxjs';
import { UserStatus } from '../enum/users.enum';
import { User } from '../schema/user.schema';
import { userStub } from '../stubs/user.stub';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UsersModel } from './__mocks__/users.model';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: UsersModel;
  describe('CREATE operations', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          JwtModule.register({
            secret: process.env.JWTSECRETKEY,
            signOptions: { expiresIn: '600s' },
          }),
        ],
        providers: [
          UsersService,
          {
            provide: getModelToken(User.name),
            useValue: UsersModel,
          },
        ],
      }).compile();
      userModel = module.get<UsersModel>(getModelToken(User.name));
      usersService = module.get<UsersService>(UsersService);
    });
    it('UsersService should be defined', () => {
      expect(usersService).toBeDefined();
    });
    describe('create', () => {
      describe('when create is called', () => {
        let user: User;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;
        let newUser = new CreateUserDto();
        newUser.email = 'katul@ajus.com';
        newUser.name = 'katul';
        newUser.password = '12356777';

        it('should throw error when email isNull', async () => {
          newUser.email = undefined;
          try {
            await usersService.create(newUser);
          } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.message).toBe('email is required.');
          }
        });
        it('should throw error when name isNull', async () => {
          newUser.email = 'katul@ajus.com';
          newUser.name = '';
          try {
            await usersService.create(newUser);
          } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.message).toBe('name is required.');
          }
        });
        it('should throw error when password less then 6 character', async () => {
          newUser.email = 'katul@ajus.com';
          newUser.name = 'katul';
          newUser.password = '123';
          try {
            await usersService.create(newUser);
          } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.message).toBe('password must more then 6 character');
          }
        });
        beforeEach(async () => {
          const xx = {
            email: 'katul@ajus.com',
            name: 'katul',
            password: '123456',
          };

          saveSpy = jest.spyOn(UsersModel.prototype, 'save');
          constructorSpy = jest.spyOn(UsersModel.prototype, 'constructorSpy');
          user = await usersService.create(xx);
        });

        test('then it should call the create new and save a model', () => {
          expect(constructorSpy).toHaveBeenCalled();
          expect(saveSpy).toHaveBeenCalled();
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });
  });

  describe('FIND & Check operations', () => {
    let userModel: UsersModel;
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          JwtModule.register({
            secret: process.env.JWTSECRETKEY,
            signOptions: { expiresIn: '600s' },
          }),
        ],
        providers: [
          UsersService,
          {
            provide: getModelToken(User.name),
            useClass: UsersModel,
          },
        ],
      }).compile();
      usersService = module.get<UsersService>(UsersService);
      userModel = module.get<UsersModel>(getModelToken(User.name));
    });

    describe('duplicatedUser check', () => {
      let isDuplicated: boolean;
      let newUser = new CreateUserDto();
      newUser.email = 'katul@ajus.com';
      newUser.name = 'katul';
      newUser.password = '12356777';
      it('should have duplicatedUser() function', () => {
        expect(usersService.duplicatedUser).toBeDefined();
      });
      beforeEach(async () => {
        jest.spyOn(userModel, 'findOne');
      });

      it('should throw error when duplicated', async () => {
        try {
          await usersService.duplicatedUser(newUser);
        } catch (error) {
          expect(userModel.findOne).toBeDefined();
          expect(userModel.findOne).toHaveBeenCalled();
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('email or name has been registered');
        }
      });
      it('should throw error when wrong password', async () => {
        try {
          await usersService.duplicatedUser(newUser);
        } catch (error) {
          expect(userModel.findOne).toBeDefined();
          expect(userModel.findOne).toHaveBeenCalled();
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('email or name has been registered');
        }
      });

      it('should return false', async () => {
        jest.spyOn(userModel, 'findOne').mockReturnValue(null);
        isDuplicated = await usersService.duplicatedUser(newUser);
        expect(userModel.findOne).toBeDefined();
        expect(userModel.findOne).toHaveBeenCalled();
        expect(isDuplicated).toEqual(false);
      });
    });
    describe('findByLogin', () => {
      let user: User;
      it('should have findByLogin() function', () => {
        expect(usersService.findByLogin).toBeDefined();
      });

      it('should throw error when email not register', async () => {
        jest.spyOn(userModel, 'findOne').mockImplementation(() => {
          return {
            exec: () => null,
          };
        });

        try {
          await usersService.findByLogin({
            password: 'ajus',
            email: 'ajus@katul.com',
          });
        } catch (error) {
          expect(userModel.findOne).toBeDefined();
          expect(userModel.findOne).toHaveBeenCalled();
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('email not registered');
        }
      });
      it('should throw error when wrong password', async () => {
        jest.spyOn(userModel, 'findOne');
        jest.spyOn(bcrypt, 'compare').mockReturnValue(null);
        try {
          await usersService.findByLogin({
            password: 'ajus',
            email: 'ajus@katul.com',
          });
        } catch (error) {
          expect(userModel.findOne).toHaveBeenCalled();
          expect(bcrypt.compare).toHaveBeenCalled();
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('invalid password');
        }
      });
      it('should return user', async () => {
        jest.spyOn(userModel, 'findOne');
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
        user = await usersService.findByLogin({
          password: 'ajus',
          email: 'ajus@katul.com',
        });
        expect(userModel.findOne).toHaveBeenCalled();
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(user).toEqual(userStub());
      });
    });
    describe('findAll', () => {
      let users: User[];
      it('should have findAll() function', () => {
        expect(usersService.findAll).toBeDefined();
      });
      beforeEach(async () => {
        jest.spyOn(userModel, 'find');
        users = await usersService.findAll();
      });
      it('should call UserModel find() function', () => {
        expect(userModel.find).toBeDefined();
        expect(userModel.find).toHaveBeenCalledWith();
        expect(users).toEqual([userStub()]);
      });
    });
    describe('findById', () => {
      let user: User;
      let id = '123';
      it('should have findById() function', () => {
        expect(usersService.findById).toBeDefined();
      });
      beforeEach(async () => {
        jest.spyOn(userModel, 'findById');
        user = await usersService.findById(id);
      });
      it('then it should call the userModel findById(id)', () => {
        expect(userModel.findById).toBeDefined();
        expect(userModel.findById).toHaveBeenCalledWith(id);
        expect(user).toEqual(userStub());
      });
    });
    describe('findByFilter', () => {
      let user: User[];
      let filter = {
        name: { $regex: 'waw' },
      };
      it('should have findByFilter() function', () => {
        expect(usersService.find).toBeDefined();
      });
      beforeEach(async () => {
        jest.spyOn(userModel, 'find');
        user = await usersService.find(filter);
      });
      it('then it should call the userModel find(filter)', () => {
        expect(userModel.find).toBeDefined();
        expect(userModel.find).toHaveBeenCalledWith(filter);
        expect(user).toEqual([userStub()]);
      });
    });
    describe('updateById', () => {
      let user: User;

      it('should have updateById() function', () => {
        expect(usersService.updateById).toBeDefined();
      });
      beforeEach(async () => {
        jest.spyOn(userModel, 'findByIdAndUpdate');
      });
      it('should throw error when name allready exis', async () => {
        jest.spyOn(userModel, 'count');
        let update = {
          name: 'katul',
        };
        try {
          user = await usersService.updateById('123', update);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('name allredy exis');
        }
      });
      it('should throw error when email allready exis', async () => {
        jest.spyOn(userModel, 'count');
        let update = {
          email: 'katul@ajus.com',
        };
        try {
          user = await usersService.updateById('123', update);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('email allredy exis');
        }
      });
      it('should throw error when password more then 6 character', async () => {
        jest.spyOn(userModel, 'count');
        let update = {
          password: '123',
        };
        try {
          user = await usersService.updateById('123', update);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('password not more then 6 character');
        }
      });
      it('should call userModel  findByIdAndUpdate ', async () => {
        jest.spyOn(userModel, 'count').mockReturnValue(undefined);
        let update = {
          name: 'katul',
          email: 'katul@ajus.com',
          password: '123456',
        };
        user = await usersService.updateById('123', update);

        expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
        expect(userModel.count).toHaveBeenCalledTimes(2);
        expect(user).toEqual(userStub());
      });
    });

    describe('removeById', () => {
      let user: User;

      it('should have removeById() function', () => {
        expect(usersService.removeById).toBeDefined();
      });
      beforeEach(async () => {
        jest.spyOn(userModel, 'findByIdAndRemove');
        user = await usersService.removeById('123');
      });
      it('then it should call the userModel findByIdAndRemove(id)', () => {
        expect(userModel.findByIdAndRemove).toBeDefined();
        expect(userModel.findByIdAndRemove).toHaveBeenCalledWith('123');
        expect(user).toEqual(userStub());
      });
    });
  });
});

//describe('findAll',()=>{})
