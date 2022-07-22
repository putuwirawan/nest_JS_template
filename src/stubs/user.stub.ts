import { UserStatus } from 'src/enum/users.enum';
import { ObjectID } from 'typeorm';

export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserStatus;
};

export const userStub = (): UserType => {
  return {
    _id: '123',
    email: 'test@example.com',
    password: '$2b$10$IVtXCT3UACEyy0JlCRMCFuexhAOSmHXVrJqLj5uWACbibU1tNBozK',
    name: 'wawanlahne',
    role: UserStatus.User,
  };
};
