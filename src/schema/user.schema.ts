import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from 'src/enum/users.enum';

var uniqueValidator = require('mongoose-unique-validator');

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    message: 'name allready exis',
    uppercase: true,
  })
  name: string;

  @Prop({ required: true, unique: true, message: 'email allready exis' })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.User })
  role: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(uniqueValidator);
