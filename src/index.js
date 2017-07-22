/* eslint-disable no-console*/

import express from 'express';

import constants from './config/constants';
import './config/database';
import middlewaresConfig from './config/middlewares';
import apiRoutes from './modules';

const app = express();

middlewaresConfig(app);

// Assign the routes to the app.
apiRoutes(app);

app.listen(constants.PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(`
        ╔═══════════════════════════╗
        ║   SERVER RUNNING ON ${constants.PORT}  ║
        ╚═══════════════════════════╝
      `);
  }
});
