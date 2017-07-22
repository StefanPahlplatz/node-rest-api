import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

import { passwordReg } from './user.validation';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  firstName: {
    type: String,
    required: [true, 'firstName is required!'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required!'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'username is required!'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'password is required!'],
    trim: true,
    minlength: [6, 'Password needs to be longer'],
    validate: {
      validator(password) {
        return passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password',
    },
  },
});

export default mongoose.model('User', UserSchema);
