import { Page, expect } from "@playwright/test";

/**
 * Common utilities for E2E tests
 */

export interface TestUser {
  email: string;
  password: string;
  role: "student" | "admin" | "superadmin";
}

export const TEST_USERS = {
  student: {
    email: "student@test.com",
    password: "testpass123",
    role: "student" as const,
  },
  admin: {
    email: "admin@test.com",
    password: "adminpass123",
    role: "admin" as const,
  },
  superadmin: {
    email: "superadmin@test.com",
    password: "superpass123",
    role: "superadmin" as const,
  },
};

/**
 * Authentication utilities
 */
export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Login with provided credentials
   */
  async login(user: TestUser) {
    await this.page.goto("/login");

    // Wait for login form to load
    await this.page.waitForSelector('input[type="email"]');

    // Fill login form
    await this.page.fill('input[type="email"]', user.email);
    await this.page.fill('input[type="password"]', user.password);

    // Submit form
    await this.page.click('button[type="submit"]');

    // Wait for navigation
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Login as super admin
   */
  async loginAsSuperAdmin() {
    await this.page.goto("/login");

    // Look for super admin login option
    const superAdminLink = this.page.locator("text=Super Admin Login");
    if (await superAdminLink.isVisible()) {
      await superAdminLink.click();
      await this.page.waitForLoadState("networkidle");
    }

    // Fill super admin credentials
    await this.page.fill('input[name="username"]', TEST_USERS.superadmin.email);
    await this.page.fill(
      'input[name="password"]',
      TEST_USERS.superadmin.password
    );
    await this.page.click('button[type="submit"]');

    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Logout from the application
   */
  async logout() {
    // Look for logout button in header/navigation
    const logoutButton = this.page.locator(
      'text=Logout, button:has-text("Logout"), [data-testid="logout"]'
    );

    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.page.waitForLoadState("networkidle");
    }
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check for user-specific elements that indicate login
      const userIndicator = this.page.locator(
        '[data-testid="user-info"], .user-info, text=Dashboard'
      );
      return await userIndicator.isVisible();
    } catch {
      return false;
    }
  }
}

/**
 * Navigation utilities
 */
export class NavigationHelper {
  constructor(private page: Page) {}

  /**
   * Navigate to student dashboard
   */
  async goToStudentDashboard() {
    await this.page.goto("/student/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to admin dashboard
   */
  async goToAdminDashboard() {
    await this.page.goto("/admin");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to problems page
   */
  async goToProblems() {
    await this.page.goto("/problems");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to MCQ page
   */
  async goToMCQ() {
    await this.page.goto("/mcq");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to exams page
   */
  async goToExams() {
    await this.page.goto("/student/exams");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to interviews page
   */
  async goToInterviews() {
    await this.page.goto("/student/interviews");
    await this.page.waitForLoadState("networkidle");
  }
}

/**
 * Common page interactions
 */
export class PageHelper {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingComplete() {
    await this.page.waitForSelector('[data-testid="loading"], .loading', {
      state: "hidden",
      timeout: 10000,
    });
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) || "";
  }

  /**
   * Click element with retry
   */
  async clickWithRetry(selector: string, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.click(selector);
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Fill form field with retry
   */
  async fillWithRetry(selector: string, value: string, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.fill(selector, value);
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Wait for API response
   */
  async waitForAPIResponse(urlPattern: string) {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes(urlPattern) && response.status() === 200
    );
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
    });
  }
}

/**
 * Error boundary testing utilities
 */
export class ErrorBoundaryHelper {
  constructor(private page: Page) {}

  /**
   * Check if error boundary is displayed
   */
  async isErrorBoundaryVisible(): Promise<boolean> {
    return await this.page
      .locator(
        'text=Something went wrong, text=Error occurred, [data-testid="error-boundary"]'
      )
      .isVisible();
  }

  /**
   * Get error boundary message
   */
  async getErrorBoundaryMessage(): Promise<string> {
    const errorElement = this.page.locator(
      'text=Something went wrong, text=Error occurred, [data-testid="error-boundary"]'
    );
    return (await errorElement.textContent()) || "";
  }

  /**
   * Click retry button in error boundary
   */
  async clickRetryButton() {
    await this.page.click(
      'text=Retry, button:has-text("Retry"), [data-testid="retry-button"]'
    );
  }
}

/**
 * Test data utilities
 */
export class TestDataHelper {
  constructor(private page: Page) {}

  /**
   * Create test MCQ
   */
  async createTestMCQ() {
    // Navigate to admin MCQ page
    await this.page.goto("/admin/mcq/add");

    // Fill MCQ form
    await this.page.fill('input[name="question"]', "Test MCQ Question");
    await this.page.fill(
      'textarea[name="options"]',
      "Option A\nOption B\nOption C\nOption D"
    );
    await this.page.selectOption('select[name="correctAnswer"]', "0");
    await this.page.selectOption('select[name="category"]', "Programming");
    await this.page.selectOption('select[name="difficulty"]', "Easy");

    // Submit form
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Create test problem
   */
  async createTestProblem() {
    // Navigate to admin problems page
    await this.page.goto("/admin/problems/add");

    // Fill problem form
    await this.page.fill('input[name="title"]', "Test Problem");
    await this.page.fill(
      'textarea[name="description"]',
      "Test problem description"
    );
    await this.page.fill('textarea[name="testCases"]', "[]");
    await this.page.selectOption('select[name="category"]', "Programming");
    await this.page.selectOption('select[name="difficulty"]', "Easy");

    // Submit form
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState("networkidle");
  }
}

/**
 * Assertion utilities
 */
export class AssertionHelper {
  constructor(private page: Page) {}

  /**
   * Assert page title
   */
  async assertPageTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert URL contains
   */
  async assertURLContains(text: string) {
    await expect(this.page).toHaveURL(new RegExp(text));
  }

  /**
   * Assert element is visible
   */
  async assertElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Assert element contains text
   */
  async assertElementContainsText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Assert form field has value
   */
  async assertFormFieldValue(selector: string, expectedValue: string) {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
  }

  /**
   * Assert API response status
   */
  async assertAPIResponse(urlPattern: string, expectedStatus: number) {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(urlPattern)
    );
    expect(response.status()).toBe(expectedStatus);
  }
}
