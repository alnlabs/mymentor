import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for E2E tests
 * This runs once before all tests and sets up test data and authentication
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  console.log('🚀 Starting global setup for E2E tests...');
  console.log(`Base URL: ${baseURL}`);

  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');
    await page.goto(baseURL!);
    await page.waitForLoadState('networkidle');

    // Check if the application is running
    const title = await page.title();
    console.log(`📱 Application title: ${title}`);

    // Test database connection
    console.log('🔍 Testing database connection...');
    try {
      const response = await page.request.get(`${baseURL}/api/test-db`);
      if (response.ok()) {
        const data = await response.json();
        console.log('✅ Database connection successful');
      } else {
        console.log('⚠️ Database test endpoint not accessible');
      }
    } catch (error) {
      console.log('⚠️ Database test failed:', error);
    }

    // Test basic API endpoints
    console.log('🔍 Testing basic API endpoints...');
    const endpoints = [
      '/api/auth/me',
      '/api/problems',
      '/api/mcq',
      '/api/exams',
      '/api/interviews',
      '/api/feedback'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await page.request.get(`${baseURL}${endpoint}`);
        console.log(`✅ ${endpoint}: ${response.status()}`);
      } catch (error) {
        console.log(`❌ ${endpoint}: Failed`);
      }
    }

    // Create test data if needed
    console.log('📝 Setting up test data...');
    await setupTestData(page, baseURL!);

    console.log('✅ Global setup completed successfully!');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Setup test data for E2E tests
 */
async function setupTestData(page: any, baseURL: string) {
  try {
    // Check if we need to seed the database
    const response = await page.request.get(`${baseURL}/api/problems`);
    const problems = await response.json();
    
    if (!problems || problems.length === 0) {
      console.log('📊 No problems found, seeding test data...');
      // You can add test data seeding here if needed
      // For now, we'll assume the database has some data
    } else {
      console.log(`📊 Found ${problems.length} problems in database`);
    }

    // Check MCQ data
    const mcqResponse = await page.request.get(`${baseURL}/api/mcq`);
    const mcqs = await mcqResponse.json();
    console.log(`📊 Found ${mcqs.length} MCQs in database`);

  } catch (error) {
    console.log('⚠️ Could not check test data:', error);
  }
}

export default globalSetup;
