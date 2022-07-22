import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
export type OptionFindType = {
  skip: number;
  limit?: number;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async duplicatedUser({
    name,
    email,
  }: {
    name: string;
    email: string;
  }): Promise<boolean> {
    let isDuplicated: boolean;
    isDuplicated = false;

    const user = await this.userModel.findOne({
      $or: [{ name: name.toUpperCase() }, { email: email }],
    });
    if (user)
      throw new HttpException(
        'email or name has been registered',
        HttpStatus.NOT_ACCEPTABLE,
      );
    return isDuplicated;
  }

  async create(newUser: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(newUser.password, saltOrRounds);
    if (!newUser.email)
      throw new HttpException('email is required.', HttpStatus.BAD_REQUEST);
    if (!newUser.name)
      throw new HttpException('name is required.', HttpStatus.BAD_REQUEST);
    if (!newUser.password || newUser.password.length < 6)
      throw new HttpException(
        'password must more then 6 character',
        HttpStatus.BAD_REQUEST,
      );

    let newParams = {
      name: newUser.name.toLocaleUpperCase(),
      email: newUser.email,
      password: hash,
    };

    const xx = new this.userModel(newParams);
    return xx.save();
  }

  async findByLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.userModel
      .findOne({ email: email }, { __v: 0 })
      .exec();

    if (!user)
      throw new HttpException('email not registered', HttpStatus.UNAUTHORIZED);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    throw new HttpException('invalid password', HttpStatus.UNAUTHORIZED);
  }

  async findAll(option?: OptionFindType): Promise<User[]> {
    let _skip: number = 0;
    let _limit: number = 0;
    let users: User[];
    if (option && option.skip) _skip = option.skip;
    if (option && option.limit) _limit = option.limit;
    try {
      users = await this.userModel.find().skip(_skip).limit(_limit).exec();
    } catch (error) {
      throw new HttpException(
        ` ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return users;
  }

  async findById(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(
        ` ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }

  async find(
    filter: FilterQuery<User>,
    option?: OptionFindType,
  ): Promise<User[]> {
    let _skip: number = 0;
    let _limit: number = 0;
    if (option && option.skip) _skip = option.skip;
    if (option && option.limit) _limit = option.limit;
    return this.userModel.find(filter).skip(_skip).limit(_limit).exec();
  }
  // async findOne(filter: FilterQuery<User>) {
  //   return this.userModel.findOne(filter).exec();
  // }
  async updateById(id: string, update: Partial<UpdateUserDto>): Promise<User> {
    let newUpdate = update;
    if (update.name) {
      const count = await this.userModel
        .count({ name: update.name.toLocaleUpperCase() })
       
      if (count)
        throw new HttpException(`name allredy exis`, HttpStatus.BAD_REQUEST);

      newUpdate = { ...newUpdate, name: update.name.toLocaleUpperCase() };
    }
    if (update.email) {
      const count = await this.userModel.count({ email: update.email })
      if (count)
        throw new HttpException(`email allredy exis`, HttpStatus.BAD_REQUEST);
    }

    if (update.password) {
      if (update.password.length < 6)
        throw new HttpException(
          `password not more then 6 character`,
          HttpStatus.BAD_REQUEST,
        );
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(newUpdate.password, saltOrRounds);
      newUpdate = { ...newUpdate, password: hash };
    }
    let user: User;
    try {
      user = await this.userModel
        .findByIdAndUpdate(id, newUpdate, { new: true })
        .exec();
    } catch (error) {
      throw new HttpException(
        ` ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }

  async removeById(id: string) {
    let user: User;
    try {
      user = await this.userModel.findByIdAndRemove(id).exec();
    } catch (error) {
      throw new HttpException(
        ` ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }
}
