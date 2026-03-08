import { config as loadEnv } from 'dotenv';

loadEnv();

export interface TestEnvironment {
  baseUrl: string;
  username: string;
  password: string;
}

export const getTestEnvironment = (): TestEnvironment => {
  const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  if (!username || !password) {
    throw new Error('USERNAME and PASSWORD must be defined in environment variables');
  }

  return {
    baseUrl,
    username,
    password
  };
};

