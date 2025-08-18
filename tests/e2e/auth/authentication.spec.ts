import { test, expect } from '@playwright/test';
import { AuthHelper, PageHelper, AssertionHelper, TEST_USERS } from '../common/utils';

test.describe('Authentication System', () => {
  let authHelper: AuthHelper;
  let pageHelper: PageHelper;
  let assertionHelper: AssertionHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    pageHelper = new PageHelper(page);
    assertionHelper = new AssertionHelper(page);
  });

  test.describe('Login Page', () => {
    test('should display login page correctly', async ({ page }) => {
      await page.goto('/login');
      
      // Check page title
      await assertionHelper.assertPageTitle(/login/i);
      
      // Check for login form elements
      await assertionHelper.assertElementVisible('input[type="email"]');
      await assertionHelper.assertElementVisible('input[type="password"]');
      await assertionHelper.assertElementVisible('button[type="submit"]');
      
      // Check for Google OAuth button
      await assertionHelper.assertElementVisible('button:has-text("Google")');
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=required, text=invalid')).toBeVisible();
    });

    test('should handle invalid credentials gracefully', async ({ page }) => {
      await page.goto('/login');
      
      // Fill with invalid credentials
      await page.fill('input[type="email"]', 'invalid@test.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=Invalid credentials, text=Login failed')).toBeVisible();
    });

    test('should redirect to dashboard after successful login', async ({ page }) => {
      await page.goto('/login');
      
      // Fill with valid credentials (assuming test user exists)
      await page.fill('input[type="email"]', TEST_USERS.student.email);
      await page.fill('input[type="password"]', TEST_USERS.student.password);
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await page.waitForURL(/dashboard/);
      await assertionHelper.assertURLContains('dashboard');
    });
  });

  test.describe('Super Admin Login', () => {
    test('should display super admin login option', async ({ page }) => {
      await page.goto('/login');
      
      // Look for super admin login link
      const superAdminLink = page.locator('text=Super Admin Login, a:has-text("Super Admin")');
      if (await superAdminLink.isVisible()) {
        await superAdminLink.click();
        await page.waitForLoadState('networkidle');
        
        // Should show super admin login form
        await assertionHelper.assertElementVisible('input[name="username"]');
        await assertionHelper.assertElementVisible('input[name="password"]');
      }
    });

    test('should handle super admin login', async ({ page }) => {
      await page.goto('/login');
      
      // Look for super admin login link
      const superAdminLink = page.locator('text=Super Admin Login, a:has-text("Super Admin")');
      if (await superAdminLink.isVisible()) {
        await superAdminLink.click();
        await page.waitForLoadState('networkidle');
        
        // Fill super admin credentials
        await page.fill('input[name="username"]', TEST_USERS.superadmin.email);
        await page.fill('input[name="password"]', TEST_USERS.superadmin.password);
        await page.click('button[type="submit"]');
        
        // Should redirect to admin dashboard
        await page.waitForURL(/admin/);
        await assertionHelper.assertURLContains('admin');
      }
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session after page refresh', async ({ page }) => {
      // Login first
      await authHelper.login(TEST_USERS.student);
      
      // Verify logged in
      expect(await authHelper.isLoggedIn()).toBeTruthy();
      
      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should still be logged in
      expect(await authHelper.isLoggedIn()).toBeTruthy();
    });

    test('should logout successfully', async ({ page }) => {
      // Login first
      await authHelper.login(TEST_USERS.student);
      
      // Verify logged in
      expect(await authHelper.isLoggedIn()).toBeTruthy();
      
      // Logout
      await authHelper.logout();
      
      // Should be logged out
      expect(await authHelper.isLoggedIn()).toBeFalsy();
      
      // Should redirect to login page
      await assertionHelper.assertURLContains('login');
    });
  });

  test.describe('Route Protection', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Try to access protected route without login
      await page.goto('/student/dashboard');
      
      // Should redirect to login
      await assertionHelper.assertURLContains('login');
    });

    test('should allow authenticated users to access protected routes', async ({ page }) => {
      // Login first
      await authHelper.login(TEST_USERS.student);
      
      // Try to access protected route
      await page.goto('/student/dashboard');
      
      // Should be able to access
      await assertionHelper.assertURLContains('dashboard');
      await assertionHelper.assertElementVisible('text=Dashboard');
    });

    test('should restrict admin routes to admin users', async ({ page }) => {
      // Login as student
      await authHelper.login(TEST_USERS.student);
      
      // Try to access admin route
      await page.goto('/admin');
      
      // Should be denied access
      await expect(page.locator('text=Access denied, text=Unauthorized, text=Forbidden')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network error by going offline
      await page.context().setOffline(true);
      
      await page.goto('/login');
      await page.fill('input[type="email"]', TEST_USERS.student.email);
      await page.fill('input[type="password"]', TEST_USERS.student.password);
      await page.click('button[type="submit"]');
      
      // Should show network error message
      await expect(page.locator('text=Network error, text=Connection failed')).toBeVisible();
      
      // Go back online
      await page.context().setOffline(false);
    });

    test('should handle server errors gracefully', async ({ page }) => {
      await page.goto('/login');
      
      // Mock server error response
      await page.route('**/api/auth/login', route => {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      });
      
      await page.fill('input[type="email"]', TEST_USERS.student.email);
      await page.fill('input[type="password"]', TEST_USERS.student.password);
      await page.click('button[type="submit"]');
      
      // Should show server error message
      await expect(page.locator('text=Server error, text=Something went wrong')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/login');
      
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.locator('input[type="email"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('input[type="password"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('button[type="submit"]')).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/login');
      
      // Check for ARIA labels
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      await expect(emailInput).toHaveAttribute('aria-label');
      await expect(passwordInput).toHaveAttribute('aria-label');
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/login');
      
      // Check that form is usable on mobile
      await assertionHelper.assertElementVisible('input[type="email"]');
      await assertionHelper.assertElementVisible('input[type="password"]');
      await assertionHelper.assertElementVisible('button[type="submit"]');
      
      // Check that elements are properly sized for touch
      const emailInput = page.locator('input[type="email"]');
      const emailBox = await emailInput.boundingBox();
      expect(emailBox!.height).toBeGreaterThan(40); // Minimum touch target size
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/login');
      
      // Check that layout adapts to tablet
      await assertionHelper.assertElementVisible('input[type="email"]');
      await assertionHelper.assertElementVisible('input[type="password"]');
      await assertionHelper.assertElementVisible('button[type="submit"]');
    });
  });
});
