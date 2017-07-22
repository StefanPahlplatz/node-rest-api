/* eslint-disable no-console*/

import mongoose from 'mongoose';

import constants from './constants';

// Remove the warnings with Promise
mongoose.Promise = global.Promise;

// Connect the db with the url provided
try {
  mongoose.connect(constants.MONGO_URL);
} catch (e) {
  mongoose.createConnection(constants.MONGO_URL);
}

mongoose.connection
  .once('open', () => {})
  .on('error', e => {
    throw e;
  });
