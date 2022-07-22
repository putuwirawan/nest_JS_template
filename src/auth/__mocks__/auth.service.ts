import { userStub } from '../../stubs/user.stub';

export const AuthService = jest.fn().mockReturnValue({
  validateUser: jest.fn().mockResolvedValue(userStub()),
  login: jest.fn(() => {
    return { access_token: 'TOKEN' };
  }),
  registerUser: jest.fn().mockResolvedValue(userStub()),
});
