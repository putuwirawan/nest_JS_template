import { Test, TestingModule } from '@nestjs/testing';

import { userStub } from 'src/stubs/user.stub';
import { User } from '../schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service');
describe('UsersController', () => {
  let userController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('UsersService should be defined', () => {
    expect(userController).toBeDefined();
  });
  describe('create', () => {
    let user: User;
    let newUser: CreateUserDto = {
      email: 'test@example.com',
      name: 'wawanlahne',
      password: '1234564',
    };
    it('should have duplicatedUser function', () => {
      expect(userController.create).toBeDefined();
    });
    beforeEach(async () => {
      user = await userController.create(newUser);
    });

    it('should call userservice.duplicatedCheck and userservice.create ', async () => {
      expect(usersService.duplicatedUser).toBeCalled();
      expect(usersService.create).toBeCalled();
      expect(usersService.create).toHaveBeenCalledWith(newUser);
    });

    it('should return user', async () => {
      expect(user).toEqual(userStub());
    });
  });
  describe('findAll', () => {
    let users: User[];
    it('should have  findAll function', () => {
      expect(userController.findAll).toBeDefined();
    });
    beforeEach(async () => {
      users = await userController.findAll();
    });
    it('should  call userservice   findAll function', () => {
      expect(usersService.findAll).toBeDefined();
      expect(usersService.findAll).toHaveBeenCalled();
      expect(users).toEqual([userStub()]);
    });
  });
  describe('findById', () => {
    let user: User;
    it('should have  findById function', () => {
      expect(userController.findById).toBeDefined();
    });
    beforeEach(async () => {
      user = await userController.findById('123');
    });
    it('should  call userservice   findAll function', () => {
      expect(usersService.findById).toBeDefined();
      expect(usersService.findById).toHaveBeenCalledWith('123');
      expect(user).toEqual(userStub());
    });
  });
  describe('updateById', () => {
    let user: User;
    it('should have  updateById function', () => {
      expect(userController.updateById).toBeDefined();
    });
    beforeEach(async () => {
      user = await userController.updateById('123', { name: 'katul' });
    });
    it('should  call userservice   findAll function', () => {
      expect(usersService.updateById).toBeDefined();
      expect(usersService.updateById).toHaveBeenCalledWith('123', {
        name: 'katul',
      });
      expect(user).toEqual(userStub());
    });
  });
  describe('removeById', () => {
    let user: User;
    it('should have  removeById function', () => {
      expect(userController.removeById).toBeDefined();
    });
    beforeEach(async () => {
      user = await userController.removeById('123');
    });
    it('should  call userservice   removeById function', () => {
      expect(usersService.removeById).toBeDefined();
      expect(usersService.removeById).toHaveBeenCalledWith('123');
      expect(user).toEqual(userStub());
    });
  });

});
