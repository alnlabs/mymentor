# MyMentor E2E Testing Guide

## Overview
This guide provides comprehensive instructions for running end-to-end tests for the MyMentor interview platform using Playwright.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Development server running on port 4700

### Installation
```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# View test reports
npm run test:e2e:report
```

## 📁 Test Structure

```
tests/e2e/
├── auth/                    # Authentication tests
│   └── authentication.spec.ts
├── student/                 # Student interface tests
│   └── dashboard.spec.ts
├── mcq/                     # MCQ system tests
│   └── mcq.spec.ts
├── problems/                # Coding problems tests
├── exams/                   # Exam system tests
├── interviews/              # Interview system tests
├── admin/                   # Admin interface tests
├── common/                  # Shared utilities
│   └── utils.ts
├── global-setup.ts          # Global test setup
└── global-teardown.ts       # Global test cleanup
```

## 🧪 Test Categories

### 1. Authentication Tests (`auth/authentication.spec.ts`)
- **Login Page**: Form validation, error handling, successful login
- **Super Admin Login**: Admin authentication flow
- **Session Management**: Session persistence, logout functionality
- **Route Protection**: Access control for protected routes
- **Error Handling**: Network errors, server errors
- **Accessibility**: Keyboard navigation, ARIA labels
- **Responsive Design**: Mobile, tablet, desktop layouts

### 2. Student Dashboard Tests (`student/dashboard.spec.ts`)
- **Dashboard Access**: Authentication requirements
- **Dashboard Layout**: Statistics, recent activity, navigation
- **Navigation**: Links to all student features
- **Data Loading**: Loading states, empty data handling
- **Error Handling**: API errors, network errors, error boundaries
- **Responsive Design**: Cross-device compatibility
- **Performance**: Load times, large dataset handling
- **Accessibility**: Keyboard navigation, heading structure
- **User Experience**: State management, page refresh

### 3. MCQ System Tests (`mcq/mcq.spec.ts`)
- **MCQ List Page**: Display, filtering, search, navigation
- **Individual MCQ Page**: Question display, options, answer selection
- **Answer Submission**: Submit answers, show results
- **Results and Progress**: Track completion, show progress
- **Error Handling**: Loading errors, submission errors
- **Responsive Design**: Mobile and tablet compatibility
- **Accessibility**: Keyboard navigation, ARIA labels
- **Performance**: Load times for lists and individual MCQs

## 🔧 Test Configuration

### Playwright Config (`playwright.config.ts`)
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:4700`
- **Timeouts**: 10s for actions, 30s for navigation
- **Retries**: 2 retries on CI, 0 in development
- **Reporting**: HTML, JSON, JUnit reports
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Global Setup (`tests/e2e/global-setup.ts`)
- Application health check
- Database connection test
- API endpoint validation
- Test data preparation

### Global Teardown (`tests/e2e/global-teardown.ts`)
- Test data cleanup
- Test summary generation

## 🛠️ Test Utilities

### Common Utilities (`tests/e2e/common/utils.ts`)

#### AuthHelper
```typescript
// Login with credentials
await authHelper.login(TEST_USERS.student);

// Login as super admin
await authHelper.loginAsSuperAdmin();

// Logout
await authHelper.logout();

// Check login status
const isLoggedIn = await authHelper.isLoggedIn();
```

#### NavigationHelper
```typescript
// Navigate to different pages
await navigationHelper.goToStudentDashboard();
await navigationHelper.goToMCQ();
await navigationHelper.goToProblems();
await navigationHelper.goToExams();
await navigationHelper.goToInterviews();
```

#### PageHelper
```typescript
// Wait for page load
await pageHelper.waitForPageLoad();

// Wait for loading to complete
await pageHelper.waitForLoadingComplete();

// Check element visibility
const isVisible = await pageHelper.isVisible('selector');

// Click with retry
await pageHelper.clickWithRetry('button');

// Take screenshot
await pageHelper.takeScreenshot('test-name');
```

#### AssertionHelper
```typescript
// Assert page title
await assertionHelper.assertPageTitle('Expected Title');

// Assert URL contains
await assertionHelper.assertURLContains('dashboard');

// Assert element is visible
await assertionHelper.assertElementVisible('button');

// Assert element contains text
await assertionHelper.assertElementContainsText('h1', 'Dashboard');
```

#### ErrorBoundaryHelper
```typescript
// Check if error boundary is visible
const hasError = await errorBoundaryHelper.isErrorBoundaryVisible();

// Get error message
const errorMessage = await errorBoundaryHelper.getErrorBoundaryMessage();

// Click retry button
await errorBoundaryHelper.clickRetryButton();
```

## 🎯 Test Data

### Test Users
```typescript
export const TEST_USERS = {
  student: {
    email: 'student@test.com',
    password: 'testpass123',
    role: 'student'
  },
  admin: {
    email: 'admin@test.com',
    password: 'adminpass123',
    role: 'admin'
  },
  superadmin: {
    email: 'superadmin@test.com',
    password: 'superpass123',
    role: 'superadmin'
  }
};
```

## 📊 Test Reports

### HTML Report
After running tests, view the HTML report:
```bash
npm run test:e2e:report
```

The report includes:
- Test results summary
- Screenshots of failures
- Video recordings of failures
- Test traces for debugging
- Performance metrics

### JSON Report
Location: `test-results/results.json`
- Machine-readable test results
- Integration with CI/CD systems

### JUnit Report
Location: `test-results/results.xml`
- Standard format for CI/CD integration
- Compatible with Jenkins, GitHub Actions, etc.

## 🔍 Debugging Tests

### Debug Mode
```bash
# Run tests in debug mode
npm run test:e2e:debug
```

### UI Mode
```bash
# Run tests with interactive UI
npm run test:e2e:ui
```

### Headed Mode
```bash
# Run tests with visible browser
npm run test:e2e:headed
```

### Screenshots and Videos
- Screenshots are automatically taken on test failures
- Videos are recorded for failed tests
- All artifacts are saved in `test-results/` directory

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Environment Variables
```bash
# Set base URL for testing
BASE_URL=https://mymentor.example.com npm run test:e2e

# Run tests in CI mode
CI=true npm run test:e2e
```

## 📱 Cross-Browser Testing

### Supported Browsers
- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Mobile Chrome**: Pixel 5 viewport
- **Mobile Safari**: iPhone 12 viewport

### Running Specific Browsers
```bash
# Run tests only in Chrome
npx playwright test --project=chromium

# Run tests only in Firefox
npx playwright test --project=firefox

# Run tests only on mobile
npx playwright test --project="Mobile Chrome"
```

## 🔧 Custom Test Configuration

### Test-Specific Setup
```typescript
test.beforeEach(async ({ page }) => {
  // Setup for each test
  await authHelper.login(TEST_USERS.student);
});

test.afterEach(async ({ page }) => {
  // Cleanup after each test
  await authHelper.logout();
});
```

### Test Groups
```typescript
test.describe('Feature Group', () => {
  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

### Test Annotations
```typescript
test('should work on mobile @mobile', async ({ page }) => {
  // Mobile-specific test
});

test('should handle errors @error-handling', async ({ page }) => {
  // Error handling test
});
```

## 📈 Performance Testing

### Load Time Testing
```typescript
test('should load within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // 3 seconds
});
```

### Large Dataset Testing
```typescript
test('should handle large datasets', async ({ page }) => {
  // Mock large dataset
  await page.route('**/api/data', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(Array.from({ length: 1000 }, (_, i) => ({ id: i })))
    });
  });
  
  // Test performance with large data
  const startTime = Date.now();
  await page.goto('/data-page');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(5000); // 5 seconds
});
```

## 🛡️ Error Boundary Testing

### Component Error Testing
```typescript
test('should display error boundary on component error', async ({ page }) => {
  // Inject error into component
  await page.addInitScript(() => {
    window.addEventListener('load', () => {
      const errorEvent = new ErrorEvent('error', {
        message: 'Component error',
        filename: 'component.js'
      });
      window.dispatchEvent(errorEvent);
    });
  });
  
  await page.goto('/page-with-component');
  expect(await errorBoundaryHelper.isErrorBoundaryVisible()).toBeTruthy();
});
```

### API Error Testing
```typescript
test('should handle API errors gracefully', async ({ page }) => {
  // Mock API error
  await page.route('**/api/endpoint', route => {
    route.fulfill({ status: 500, body: 'Internal Server Error' });
  });
  
  await page.goto('/page-that-calls-api');
  await expect(page.locator('text=Error occurred')).toBeVisible();
});
```

## 📋 Best Practices

### 1. Test Organization
- Group related tests using `test.describe()`
- Use descriptive test names
- Keep tests independent and isolated

### 2. Selectors
- Use data-testid attributes when possible
- Avoid brittle selectors (text content, CSS classes)
- Prefer semantic selectors

### 3. Assertions
- Use specific assertions
- Check for both positive and negative cases
- Verify user-facing behavior, not implementation details

### 4. Error Handling
- Test error scenarios
- Verify error messages are user-friendly
- Test error recovery mechanisms

### 5. Performance
- Set reasonable timeouts
- Test with realistic data sizes
- Monitor test execution times

### 6. Accessibility
- Test keyboard navigation
- Verify ARIA labels
- Check color contrast (if applicable)

## 🚨 Troubleshooting

### Common Issues

#### Tests Failing Intermittently
- Increase timeouts
- Add explicit waits
- Use retry mechanisms

#### Selector Issues
- Use more specific selectors
- Add data-testid attributes
- Check for dynamic content

#### Browser-Specific Issues
- Test in multiple browsers
- Check browser compatibility
- Use browser-specific selectors if needed

#### Performance Issues
- Optimize test data
- Reduce unnecessary waits
- Use headless mode in CI

### Debug Commands
```bash
# Show test traces
npx playwright show-trace trace.zip

# Generate test code from actions
npx playwright codegen localhost:4700

# Test specific file
npx playwright test auth/authentication.spec.ts

# Test specific test
npx playwright test -g "should login successfully"
```

## 📞 Support

For issues with E2E tests:
1. Check the test logs and reports
2. Review the Playwright documentation
3. Check browser compatibility
4. Verify the application is running correctly

## 🎯 Next Steps

1. **Add More Test Coverage**:
   - Coding problems tests
   - Exam system tests
   - Interview system tests
   - Admin interface tests

2. **Performance Testing**:
   - Load testing with multiple users
   - Stress testing with large datasets
   - Memory usage monitoring

3. **Visual Regression Testing**:
   - Screenshot comparison
   - Visual diff detection
   - Design system testing

4. **Accessibility Testing**:
   - Automated accessibility checks
   - Screen reader testing
   - Keyboard navigation testing

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Ready for Use
