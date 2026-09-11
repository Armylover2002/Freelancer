import 'dotenv/config';

// Redirect tests to an isolated "<db>_test" database so test runs never touch real data.
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('_test')) {
  process.env.MONGODB_URI = process.env.MONGODB_URI.replace(/\/([A-Za-z0-9_-]+)(\?|$)/, '/$1_test$2');
}
process.env.NODE_ENV = 'test';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'test-owner@agency.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TestPassword123!';
