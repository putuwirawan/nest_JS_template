import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';

@ValidatorConstraint({ name: 'IsUniqueUser', async: true })
export class UniqueUserValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel('User') readonly userModel: Model<User>) {}

  async validate(value: any, args: ValidationArguments) {
    let filter = {};

    filter[args.property] = value;

    const count = await this.userModel.count(filter).exec();
    return !count;
  }

  defaultMessage(value: any) {
    return `${value.value} is already exists`;
  }
}
