import { exec } from 'child_process';
import { FilterQuery } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { userStub } from 'src/stubs/user.stub';
import { OptionFindType } from '../users.service';

export class UsersModel {
  constructor(createEntityData: User) {
    this.constructorSpy(createEntityData);
  }
  constructorSpy(_createEntityData: User): void {}

  save() {
    return userStub();
  }
  findById(): { exec: () => User } {
    return { exec: (): User => userStub() };
  }
  findOne(): { exec: () => User } {
    return { exec: (): User => userStub() };
  }
  find = jest.fn((option: OptionFindType) => ({
    skip: (x: number) => ({
      limit: (x: number) => ({ exec: (): User[] => [userStub()] }),
    }),
  }));

  count() {
    return 1;
  }

  findByIdAndUpdate(): { exec: () => User } {
    return { exec: (): User => userStub() };
  }
  updateMany(): { exec: () => any } {
    return {
      exec: (): any => ({ matchedCount: 1, modifiedCount: 1 }),
    };
  }
  findByIdAndRemove(): { exec: () => User } {
    return { exec: (): User => userStub() };
  }
  // static findByIdAndRemove = jest.fn().mockResolvedValue(userStub());
}
