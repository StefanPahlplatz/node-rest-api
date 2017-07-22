const devConfig = {
  MONGO_URL: 'mongodb://localhost/makeanodejsapi-dev',
  JWT_SECRET: 'secretkey',
};

const testConfig = {
  MONGO_URL: 'mongodb://localhost/makeanodejsapi-test',
  JWT_SECRET: 'secretkey',
};

const prodConfig = {
  MONGO_URL: 'mongodb://localhost/makeanodejsapi-prod',
  JWT_SECRET: 'secretkey',
};

const defaultConfig = {
  PORT: process.env.PORT || 3000,
};

function envConfig(env) {
  switch (env) {
    case 'development':
      return devConfig;

    case 'test':
      return testConfig;

    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};

