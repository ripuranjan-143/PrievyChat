import dotenv from 'dotenv';
dotenv.config();

const envVariables = ['MONGODB_URI', 'JWT_SECRET_KEY'];

envVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error('Missing environment variables...');
  }
});

export default {
  mongoUri: process.env.MONGODB_URI,
  secretKey: process.env.JWT_SECRET_KEY,
  port: process.env.PORT || 8080,
};
