import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
);

dotenv.config({ path: envPath });
