import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing in .env');
}

// Enforce JWT secret strength check
const weakPlaceholders = [
  'super_secret_session_passphrase_key',
  'your_jwt_secret_here',
  'secret',
  'passphrase',
  'key',
  'development',
  'test',
  'production'
];

if (JWT_SECRET.length < 32) {
  throw new Error('Security Error: JWT_SECRET environment variable must be at least 32 characters long.');
}

if (weakPlaceholders.includes(JWT_SECRET.toLowerCase())) {
  throw new Error('Security Error: JWT_SECRET environment variable cannot use weak default or placeholder values.');
}

export { JWT_SECRET };
