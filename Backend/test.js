import { config } from 'dotenv';
const result = config({ path: './.env', debug: true });
console.log('Dotenv parsed:', result.parsed);
console.log('Error:', result.error);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
