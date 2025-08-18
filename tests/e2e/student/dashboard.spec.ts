import { test, expect } from '@playwright/test';
import { AuthHelper, NavigationHelper, PageHelper, AssertionHelper, ErrorBoundaryHelper, TEST_USERS } from '../common/utils';

test.describe('Student Dashboard', () => {
  let authHelper: AuthHelper;
  let navigationHelper: NavigationHelper;
  let pageHelper: PageHelper;
  let assertionHelper: AssertionHelper;
  let errorBoundaryHelper: ErrorBoundaryHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    navigationHelper = new NavigationHelper(page);
    pageHelper = new PageHelper(page);
    assertionHelper = new AssertionHelper(page);
    errorBoundaryHelper = new ErrorBoundaryHelper(page);
  });

  test.describe('Dashboard Access', () => {
    test('should require authentication to access dashboard', async ({ page }) => {
      // Try to access dashboard without login
      await page.goto('/student/dashboard');
      
      // Should redirect to login
      await assertionHelper.assertURLContains('login');
    });

    test('should display dashboard after successful login', async ({ page }) => {
      // Login as student
      await authHelper.login(TEST_USERS.student);
      
      // Navigate to dashboard
      await navigationHelper.goToStudentDashboard();
      
      // Should display dashboard
      await assertionHelper.assertElementVisible('text=Dashboard');
      await assertionHelper.assertURLContains('dashboard');
    });
  });

  test.describe('Dashboard Layout', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
      await navigationHelper.goToStudentDashboard();
    });

    test('should display all dashboard sections', async ({ page }) => {
      // Check for main dashboard elements
      await assertionHelper.assertElementVisible('text=Dashboard');
      await assertionHelper.assertElementVisible('text=Statistics');
      await assertionHelper.assertElementVisible('text=Recent Activity');
      
      // Check for navigation elements
      await assertionHelper.assertElementVisible('text=Problems');
      await assertionHelper.assertElementVisible('text=MCQ');
      await assertionHelper.assertElementVisible('text=Exams');
      await assertionHelper.assertElementVisible('text=Interviews');
    });

    test('should display user statistics correctly', async ({ page }) => {
      // Wait for statistics to load
      await pageHelper.waitForLoadingComplete();
      
      // Check for statistics cards
      await assertionHelper.assertElementVisible('text=Total Problems');
      await assertionHelper.assertElementVisible('text=MCQs Completed');
      await assertionHelper.assertElementVisible('text=Exams Taken');
      await assertionHelper.assertElementVisible('text=Interviews Completed');
      
      // Check that statistics show numbers
      const statsElements = page.locator('[data-testid="stat-card"], .stat-card, .statistics-card');
      await expect(statsElements).toHaveCount(4);
    });

    test('should display recent activity', async ({ page }) => {
      // Wait for activity to load
      await pageHelper.waitForLoadingComplete();
      
      // Check for recent activity section
      await assertionHelper.assertElementVisible('text=Recent Activity');
      
      // Activity should be visible (even if empty)
      const activitySection = page.locator('[data-testid="recent-activity"], .recent-activity');
      await expect(activitySection).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
      await navigationHelper.goToStudentDashboard();
    });

    test('should navigate to problems page', async ({ page }) => {
      // Click on problems link
      await page.click('text=Problems, a:has-text("Problems")');
      
      // Should navigate to problems page
      await assertionHelper.assertURLContains('problems');
      await assertionHelper.assertElementVisible('text=Problems');
    });

    test('should navigate to MCQ page', async ({ page }) => {
      // Click on MCQ link
      await page.click('text=MCQ, a:has-text("MCQ")');
      
      // Should navigate to MCQ page
      await assertionHelper.assertURLContains('mcq');
      await assertionHelper.assertElementVisible('text=MCQ');
    });

    test('should navigate to exams page', async ({ page }) => {
      // Click on exams link
      await page.click('text=Exams, a:has-text("Exams")');
      
      // Should navigate to exams page
      await assertionHelper.assertURLContains('exams');
      await assertionHelper.assertElementVisible('text=Exams');
    });

    test('should navigate to interviews page', async ({ page }) => {
      // Click on interviews link
      await page.click('text=Interviews, a:has-text("Interviews")');
      
      // Should navigate to interviews page
      await assertionHelper.assertURLContains('interviews');
      await assertionHelper.assertElementVisible('text=Interviews');
    });
  });

  test.describe('Data Loading', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test('should show loading state while fetching data', async ({ page }) => {
      // Navigate to dashboard
      await page.goto('/student/dashboard');
      
      // Should show loading indicator
      await expect(page.locator('[data-testid="loading"], .loading, text=Loading')).toBeVisible();
      
      // Wait for loading to complete
      await pageHelper.waitForLoadingComplete();
      
      // Should show dashboard content
      await assertionHelper.assertElementVisible('text=Dashboard');
    });

    test('should handle empty data gracefully', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/user/stats', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalProblems: 0,
            mcqsCompleted: 0,
            examsTaken: 0,
            interviewsCompleted: 0,
            recentActivity: []
          })
        });
      });
      
      await navigationHelper.goToStudentDashboard();
      
      // Should display empty state gracefully
      await assertionHelper.assertElementVisible('text=Dashboard');
      await expect(page.locator('text=No activity yet, text=No data available')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/user/stats', route => {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      });
      
      await navigationHelper.goToStudentDashboard();
      
      // Should show error message
      await expect(page.locator('text=Error loading data, text=Something went wrong')).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Go offline
      await page.context().setOffline(true);
      
      await navigationHelper.goToStudentDashboard();
      
      // Should show network error message
      await expect(page.locator('text=Network error, text=Connection failed')).toBeVisible();
      
      // Go back online
      await page.context().setOffline(false);
    });

    test('should display error boundary when component fails', async ({ page }) => {
      // Mock component error by injecting error
      await page.addInitScript(() => {
        window.addEventListener('load', () => {
          // Simulate component error
          const errorEvent = new ErrorEvent('error', {
            message: 'Component error',
            filename: 'dashboard.js'
          });
          window.dispatchEvent(errorEvent);
        });
      });
      
      await navigationHelper.goToStudentDashboard();
      
      // Should show error boundary
      expect(await errorBoundaryHelper.isErrorBoundaryVisible()).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await navigationHelper.goToStudentDashboard();
      
      // Should display properly on mobile
      await assertionHelper.assertElementVisible('text=Dashboard');
      
      // Check that navigation is accessible on mobile
      const navButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, button:has-text("Menu")');
      if (await navButton.isVisible()) {
        await navButton.click();
        await assertionHelper.assertElementVisible('text=Problems');
        await assertionHelper.assertElementVisible('text=MCQ');
      }
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await navigationHelper.goToStudentDashboard();
      
      // Should display properly on tablet
      await assertionHelper.assertElementVisible('text=Dashboard');
      await assertionHelper.assertElementVisible('text=Statistics');
    });

    test('should work on desktop devices', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await navigationHelper.goToStudentDashboard();
      
      // Should display properly on desktop
      await assertionHelper.assertElementVisible('text=Dashboard');
      await assertionHelper.assertElementVisible('text=Statistics');
      await assertionHelper.assertElementVisible('text=Recent Activity');
    });
  });

  test.describe('Performance', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await navigationHelper.goToStudentDashboard();
      await pageHelper.waitForLoadingComplete();
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      // Mock large dataset
      await page.route('**/api/user/stats', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalProblems: 1000,
            mcqsCompleted: 500,
            examsTaken: 50,
            interviewsCompleted: 25,
            recentActivity: Array.from({ length: 100 }, (_, i) => ({
              id: i,
              type: 'problem',
              title: `Problem ${i}`,
              timestamp: new Date().toISOString()
            }))
          })
        });
      });
      
      const startTime = Date.now();
      await navigationHelper.goToStudentDashboard();
      await pageHelper.waitForLoadingComplete();
      const loadTime = Date.now() - startTime;
      
      // Should still load within reasonable time
      expect(loadTime).toBeLessThan(3000);
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
      await navigationHelper.goToStudentDashboard();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through dashboard elements
      await page.keyboard.press('Tab');
      
      // Should be able to navigate through all interactive elements
      const focusableElements = page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      await expect(focusableElements).toHaveCount.greaterThan(0);
    });

    test('should have proper heading structure', async ({ page }) => {
      // Check for proper heading hierarchy
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      await expect(headings).toHaveCount.greaterThan(0);
      
      // Should have at least one h1 (main heading)
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for ARIA labels on interactive elements
      const interactiveElements = page.locator('button, a, input, select');
      for (let i = 0; i < await interactiveElements.count(); i++) {
        const element = interactiveElements.nth(i);
        const ariaLabel = await element.getAttribute('aria-label');
        const ariaLabelledBy = await element.getAttribute('aria-labelledby');
        
        // Should have either aria-label or aria-labelledby
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });
  });

  test.describe('User Experience', () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
      await navigationHelper.goToStudentDashboard();
    });

    test('should provide clear feedback for user actions', async ({ page }) => {
      // Click on a navigation link
      await page.click('text=Problems');
      
      // Should provide visual feedback
      await expect(page.locator('text=Problems')).toBeVisible();
    });

    test('should maintain state during navigation', async ({ page }) => {
      // Navigate away from dashboard
      await page.click('text=Problems');
      await assertionHelper.assertURLContains('problems');
      
      // Navigate back to dashboard
      await page.click('text=Dashboard, a:has-text("Dashboard")');
      await assertionHelper.assertURLContains('dashboard');
      
      // Should still be logged in
      expect(await authHelper.isLoggedIn()).toBeTruthy();
    });

    test('should handle page refresh gracefully', async ({ page }) => {
      // Refresh the page
      await page.reload();
      await pageHelper.waitForPageLoad();
      
      // Should still be on dashboard and logged in
      await assertionHelper.assertURLContains('dashboard');
      expect(await authHelper.isLoggedIn()).toBeTruthy();
    });
  });
});
