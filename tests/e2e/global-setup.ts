import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Set up test environment variables
  process.env.NODE_ENV = 'test';
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
  process.env.PLAUSIBLE_DOMAIN = 'test.com';
  process.env.SITE_URL = 'http://localhost:3000';

  // Optional: Set up test database or other global resources
  console.log('Setting up E2E test environment...');
  
  // You could add database seeding, API mocking setup, etc. here
  
  console.log('E2E test environment setup complete');
}

export default globalSetup;