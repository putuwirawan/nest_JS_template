import { userStub } from '../../stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  findByLogin: jest.fn().mockResolvedValue(userStub()),
  save: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue([userStub()]),
  duplicatedUser: jest.fn().mockResolvedValue(false),
  findById: jest.fn().mockResolvedValue(userStub()),
  findOne: jest.fn().mockResolvedValue(userStub()),
  updateById: jest.fn().mockResolvedValue(userStub()),
  updateByFilter: jest.fn().mockResolvedValue({ updated: 1 }),
  removeById: jest.fn().mockResolvedValue(userStub()),
});
