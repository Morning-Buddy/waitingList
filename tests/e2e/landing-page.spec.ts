import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the landing page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Morning Buddy/);
    await expect(page.getByText('Morning Buddy')).toBeVisible();
  });

  test('should display hero section with correct content', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Morning Buddy' })).toBeVisible();
    await expect(page.getByText(/Get a morning call from an AI buddy instead of a jarring alarm/)).toBeVisible();
    await expect(page.getByRole('button', { name: /join waiting list/i })).toBeVisible();
  });

  test('should display "How It Works" section', async ({ page }) => {
    await expect(page.getByText('How It Works')).toBeVisible();
    await expect(page.getByText('Build a Buddy')).toBeVisible();
    await expect(page.getByText('Set Schedule')).toBeVisible();
    await expect(page.getByText('Wake Up Happy')).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
    
    // Test FAQ interaction
    const firstQuestion = page.getByText(/What is Morning Buddy/);
    await expect(firstQuestion).toBeVisible();
    
    // Click to expand
    await firstQuestion.click();
    await expect(page.getByText(/Morning Buddy is an AI-powered alarm clock/)).toBeVisible();
    
    // Click to collapse
    await firstQuestion.click();
    await expect(page.getByText(/Morning Buddy is an AI-powered alarm clock/)).not.toBeVisible();
  });

  test('should display social proof section', async ({ page }) => {
    // Wait for the counter to load
    await expect(page.getByText(/early risers/)).toBeVisible({ timeout: 10000 });
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Morning Buddy');
    
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toContain('Morning Buddy');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByRole('heading', { name: 'Morning Buddy' })).toBeVisible();
    await expect(page.getByRole('button', { name: /join waiting list/i })).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /join waiting list/i })).toBeFocused();
    
    // Test that all interactive elements are keyboard accessible
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
    }
  });
});