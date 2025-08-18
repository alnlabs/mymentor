import { chromium, FullConfig } from '@playwright/test';

/**
 * Global teardown for E2E tests
 * This runs once after all tests complete and handles cleanup
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...');

  try {
    // Launch browser for cleanup tasks
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Clean up any test data if needed
    console.log('🗑️ Cleaning up test data...');
    await cleanupTestData(page, config.projects[0].use.baseURL!);

    // Generate test summary
    console.log('📊 Generating test summary...');
    await generateTestSummary();

    console.log('✅ Global teardown completed successfully!');

    await browser.close();

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

/**
 * Clean up test data created during tests
 */
async function cleanupTestData(page: any, baseURL: string) {
  try {
    // Add any cleanup logic here
    // For example, delete test users, test content, etc.
    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.log('⚠️ Test data cleanup failed:', error);
  }
}

/**
 * Generate test summary
 */
async function generateTestSummary() {
  try {
    // You can add logic to generate test reports here
    console.log('✅ Test summary generated');
  } catch (error) {
    console.log('⚠️ Could not generate test summary:', error);
  }
}

export default globalTeardown;
