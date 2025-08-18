import { test, expect } from "@playwright/test";
import {
  AuthHelper,
  NavigationHelper,
  PageHelper,
  AssertionHelper,
  ErrorBoundaryHelper,
  TEST_USERS,
} from "../common/utils";

test.describe("MCQ System", () => {
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

  test.describe("MCQ List Page", () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test("should display MCQ list page correctly", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Check page title and content
      await assertionHelper.assertElementVisible("text=MCQ");
      await assertionHelper.assertElementVisible("text=Questions");

      // Check for MCQ cards
      const mcqCards = page.locator(
        '[data-testid="mcq-card"], .mcq-card, .question-card'
      );
      await expect(mcqCards).toBeVisible();
    });

    test("should display MCQ information correctly", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Wait for MCQs to load
      await pageHelper.waitForLoadingComplete();

      // Check for MCQ details
      await assertionHelper.assertElementVisible("text=Category");
      await assertionHelper.assertElementVisible("text=Difficulty");
      await assertionHelper.assertElementVisible("text=Points");
    });

    test("should filter MCQs by category", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Look for category filter
      const categoryFilter = page.locator(
        'select[name="category"], [data-testid="category-filter"]'
      );
      if (await categoryFilter.isVisible()) {
        // Select a category
        await categoryFilter.selectOption("Programming");

        // Wait for filtered results
        await pageHelper.waitForLoadingComplete();

        // Should show filtered results
        await assertionHelper.assertElementVisible("text=Programming");
      }
    });

    test("should filter MCQs by difficulty", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Look for difficulty filter
      const difficultyFilter = page.locator(
        'select[name="difficulty"], [data-testid="difficulty-filter"]'
      );
      if (await difficultyFilter.isVisible()) {
        // Select a difficulty
        await difficultyFilter.selectOption("Easy");

        // Wait for filtered results
        await pageHelper.waitForLoadingComplete();

        // Should show filtered results
        await assertionHelper.assertElementVisible("text=Easy");
      }
    });

    test("should search MCQs", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Look for search input
      const searchInput = page.locator(
        'input[placeholder*="search"], input[name="search"], [data-testid="search-input"]'
      );
      if (await searchInput.isVisible()) {
        // Enter search term
        await searchInput.fill("programming");
        await searchInput.press("Enter");

        // Wait for search results
        await pageHelper.waitForLoadingComplete();

        // Should show search results
        await assertionHelper.assertElementVisible("text=programming");
      }
    });

    test("should navigate to individual MCQ", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Wait for MCQs to load
      await pageHelper.waitForLoadingComplete();

      // Click on first MCQ
      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Should navigate to MCQ detail page
        await assertionHelper.assertURLContains("mcq/");
        await assertionHelper.assertElementVisible("text=Question");
      }
    });
  });

  test.describe("Individual MCQ Page", () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test("should display MCQ question correctly", async ({ page }) => {
      // Navigate to MCQ list and click on first MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Check question display
        await assertionHelper.assertElementVisible("text=Question");
        await assertionHelper.assertElementVisible("text=Options");
      }
    });

    test("should display MCQ options correctly", async ({ page }) => {
      // Navigate to MCQ list and click on first MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Check for options
        const options = page.locator(
          'input[type="radio"], [data-testid="option"]'
        );
        await expect(options).toHaveCount.greaterThan(0);
      }
    });

    test("should allow selecting an answer", async ({ page }) => {
      // Navigate to MCQ list and click on first MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Select an option
        const firstOption = page
          .locator('input[type="radio"], [data-testid="option"]')
          .first();
        if (await firstOption.isVisible()) {
          await firstOption.click();

          // Should show option as selected
          await expect(firstOption).toBeChecked();
        }
      }
    });

    test("should submit answer correctly", async ({ page }) => {
      // Navigate to MCQ list and click on first MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Select an option
        const firstOption = page
          .locator('input[type="radio"], [data-testid="option"]')
          .first();
        if (await firstOption.isVisible()) {
          await firstOption.click();

          // Submit answer
          const submitButton = page.locator(
            'button:has-text("Submit"), button[type="submit"], [data-testid="submit-button"]'
          );
          if (await submitButton.isVisible()) {
            await submitButton.click();

            // Should show results
            await assertionHelper.assertElementVisible(
              "text=Result, text=Correct, text=Incorrect"
            );
          }
        }
      }
    });

    test("should show correct/incorrect feedback", async ({ page }) => {
      // Navigate to MCQ list and click on first MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Select an option and submit
        const firstOption = page
          .locator('input[type="radio"], [data-testid="option"]')
          .first();
        if (await firstOption.isVisible()) {
          await firstOption.click();

          const submitButton = page.locator(
            'button:has-text("Submit"), button[type="submit"], [data-testid="submit-button"]'
          );
          if (await submitButton.isVisible()) {
            await submitButton.click();

            // Should show feedback
            await expect(
              page.locator(
                "text=Correct, text=Incorrect, text=Right, text=Wrong"
              )
            ).toBeVisible();
          }
        }
      }
    });

    test("should show explanation for answer", async ({ page }) => {
      // Navigate to MCQ list and click on first MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Select an option and submit
        const firstOption = page
          .locator('input[type="radio"], [data-testid="option"]')
          .first();
        if (await firstOption.isVisible()) {
          await firstOption.click();

          const submitButton = page.locator(
            'button:has-text("Submit"), button[type="submit"], [data-testid="submit-button"]'
          );
          if (await submitButton.isVisible()) {
            await submitButton.click();

            // Should show explanation
            await expect(
              page.locator("text=Explanation, text=Why")
            ).toBeVisible();
          }
        }
      }
    });

    test("should navigate back to MCQ list", async ({ page }) => {
      // Navigate to MCQ list and click on first MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Click back button
        const backButton = page.locator(
          'button:has-text("Back"), a:has-text("Back"), [data-testid="back-button"]'
        );
        if (await backButton.isVisible()) {
          await backButton.click();

          // Should be back on MCQ list
          await assertionHelper.assertURLContains("mcq");
          await assertionHelper.assertElementVisible("text=MCQ");
        }
      }
    });
  });

  test.describe("MCQ Results and Progress", () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test("should track MCQ completion", async ({ page }) => {
      // Complete an MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Select and submit answer
        const firstOption = page
          .locator('input[type="radio"], [data-testid="option"]')
          .first();
        if (await firstOption.isVisible()) {
          await firstOption.click();

          const submitButton = page.locator(
            'button:has-text("Submit"), button[type="submit"], [data-testid="submit-button"]'
          );
          if (await submitButton.isVisible()) {
            await submitButton.click();

            // Navigate back to dashboard
            await navigationHelper.goToStudentDashboard();

            // Should show updated MCQ completion count
            await assertionHelper.assertElementVisible("text=MCQs Completed");
          }
        }
      }
    });

    test("should show MCQ progress", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Look for progress indicators
      const progressElements = page.locator(
        '[data-testid="progress"], .progress, text=Progress'
      );
      if (await progressElements.isVisible()) {
        await assertionHelper.assertElementVisible("text=Progress");
      }
    });
  });

  test.describe("Error Handling", () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test("should handle MCQ loading errors", async ({ page }) => {
      // Mock API error
      await page.route("**/api/mcq", (route) => {
        route.fulfill({ status: 500, body: "Internal Server Error" });
      });

      await navigationHelper.goToMCQ();

      // Should show error message
      await expect(
        page.locator("text=Error loading MCQs, text=Something went wrong")
      ).toBeVisible();
    });

    test("should handle individual MCQ loading errors", async ({ page }) => {
      // Mock individual MCQ API error
      await page.route("**/api/mcq/*", (route) => {
        route.fulfill({ status: 404, body: "MCQ not found" });
      });

      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Should show error message
        await expect(
          page.locator("text=MCQ not found, text=Error loading question")
        ).toBeVisible();
      }
    });

    test("should handle submission errors", async ({ page }) => {
      // Mock submission error
      await page.route("**/api/mcq/*/submit", (route) => {
        route.fulfill({ status: 500, body: "Submission failed" });
      });

      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Select and submit answer
        const firstOption = page
          .locator('input[type="radio"], [data-testid="option"]')
          .first();
        if (await firstOption.isVisible()) {
          await firstOption.click();

          const submitButton = page.locator(
            'button:has-text("Submit"), button[type="submit"], [data-testid="submit-button"]'
          );
          if (await submitButton.isVisible()) {
            await submitButton.click();

            // Should show error message
            await expect(
              page.locator(
                "text=Submission failed, text=Error submitting answer"
              )
            ).toBeVisible();
          }
        }
      }
    });
  });

  test.describe("Responsive Design", () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test("should work on mobile devices", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await navigationHelper.goToMCQ();

      // Should display properly on mobile
      await assertionHelper.assertElementVisible("text=MCQ");

      // Check that MCQ cards are usable on mobile
      const mcqCards = page.locator(
        '[data-testid="mcq-card"], .mcq-card, .question-card'
      );
      if (await mcqCards.first().isVisible()) {
        const cardBox = await mcqCards.first().boundingBox();
        expect(cardBox!.height).toBeGreaterThan(40); // Minimum touch target size
      }
    });

    test("should work on tablet devices", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await navigationHelper.goToMCQ();

      // Should display properly on tablet
      await assertionHelper.assertElementVisible("text=MCQ");
    });
  });

  test.describe("Accessibility", () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test("should support keyboard navigation", async ({ page }) => {
      await navigationHelper.goToMCQ();

      // Tab through MCQ elements
      await page.keyboard.press("Tab");

      // Should be able to navigate through all interactive elements
      const focusableElements = page.locator(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      await expect(focusableElements).toHaveCount.greaterThan(0);
    });

    test("should have proper ARIA labels for MCQ options", async ({ page }) => {
      // Navigate to individual MCQ
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        await firstMCQ.click();

        // Check for ARIA labels on options
        const options = page.locator(
          'input[type="radio"], [data-testid="option"]'
        );
        for (let i = 0; i < (await options.count()); i++) {
          const option = options.nth(i);
          const ariaLabel = await option.getAttribute("aria-label");
          const ariaLabelledBy = await option.getAttribute("aria-labelledby");

          // Should have either aria-label or aria-labelledby
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    });
  });

  test.describe("Performance", () => {
    test.beforeEach(async ({ page }) => {
      await authHelper.login(TEST_USERS.student);
    });

    test("should load MCQ list within acceptable time", async ({ page }) => {
      const startTime = Date.now();

      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test("should load individual MCQ within acceptable time", async ({
      page,
    }) => {
      await navigationHelper.goToMCQ();
      await pageHelper.waitForLoadingComplete();

      const firstMCQ = page
        .locator('[data-testid="mcq-card"], .mcq-card, .question-card')
        .first();
      if (await firstMCQ.isVisible()) {
        const startTime = Date.now();
        await firstMCQ.click();
        await pageHelper.waitForLoadingComplete();
        const loadTime = Date.now() - startTime;

        // Should load within 2 seconds
        expect(loadTime).toBeLessThan(2000);
      }
    });
  });
});
