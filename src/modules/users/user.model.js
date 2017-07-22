import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

import { passwordReg } from './user.validation';
import constants from '../../config/constants';

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

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
  }
  return next();
});

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(encryptedPassword) {
    return compareSync(encryptedPassword, this.password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      constants.JWT_SECRET
    );
  },
  toJSON() {
    // What to return as login response.
    return {
      _id: this._id,
      username: this.username,
      token: `JWT ${this.createToken()}`,
    };
  },
};

export default mongoose.model('User', UserSchema);