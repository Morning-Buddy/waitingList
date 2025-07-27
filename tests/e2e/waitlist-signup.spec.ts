import { test, expect } from '@playwright/test';

test.describe('Waitlist Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Mock API responses to avoid hitting real endpoints
    await page.route('**/api/subscribe', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Successfully joined waitlist! Please check your email to confirm.',
            data: {
              id: 'test-id',
              email: 'test@example.com',
              name: 'Test User',
              confirmed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          })
        });
      }
    });

    await page.route('**/api/count', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { count: 1234 }
        })
      });
    });
  });

  test('should open waitlist modal when join button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    await expect(page.getByText('Join the Waiting List')).toBeVisible();
    await expect(page.getByLabel(/name \(optional\)/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/i agree to receive early-access emails/i)).toBeVisible();
  });

  test('should close modal when cancel button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /join waiting list/i }).click();
    await expect(page.getByText('Join the Waiting List')).toBeVisible();
    
    await page.getByText('Cancel').click();
    await expect(page.getByText('Join the Waiting List')).not.toBeVisible();
  });

  test('should close modal when escape key is pressed', async ({ page }) => {
    await page.getByRole('button', { name: /join waiting list/i }).click();
    await expect(page.getByText('Join the Waiting List')).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(page.getByText('Join the Waiting List')).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /join waiting list/i }).nth(1).click();
    
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/gdpr consent is required/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    await page.getByLabel(/email address/i).fill('invalid-email');
    await page.getByLabel(/i agree to receive early-access emails/i).check();
    await page.getByRole('button', { name: /join waiting list/i }).nth(1).click();
    
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test('should successfully submit valid form', async ({ page }) => {
    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    await page.getByLabel(/name \(optional\)/i).fill('John Doe');
    await page.getByLabel(/email address/i).fill('john@example.com');
    await page.getByLabel(/i agree to receive early-access emails/i).check();
    
    await page.getByRole('button', { name: /join waiting list/i }).nth(1).click();
    
    // Should redirect to thank you page
    await expect(page).toHaveURL('/thank-you');
    await expect(page.getByText(/thanks for joining/i)).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // Add delay to API response to test loading state
    await page.route('**/api/subscribe', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Successfully joined waitlist!',
          data: { id: 'test-id', email: 'test@example.com' }
        })
      });
    });

    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    await page.getByLabel(/email address/i).fill('john@example.com');
    await page.getByLabel(/i agree to receive early-access emails/i).check();
    
    await page.getByRole('button', { name: /join waiting list/i }).nth(1).click();
    
    // Should show loading state
    await expect(page.getByText('Joining...')).toBeVisible();
    await expect(page.getByRole('button', { name: /joining/i })).toBeDisabled();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/subscribe', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Server error occurred'
        })
      });
    });

    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    await page.getByLabel(/email address/i).fill('john@example.com');
    await page.getByLabel(/i agree to receive early-access emails/i).check();
    
    await page.getByRole('button', { name: /join waiting list/i }).nth(1).click();
    
    // Should show error message
    await expect(page.getByText(/server error occurred/i)).toBeVisible();
  });

  test('should handle duplicate email error', async ({ page }) => {
    // Mock duplicate email error
    await page.route('**/api/subscribe', async route => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Email address is already registered'
        })
      });
    });

    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    await page.getByLabel(/email address/i).fill('existing@example.com');
    await page.getByLabel(/i agree to receive early-access emails/i).check();
    
    await page.getByRole('button', { name: /join waiting list/i }).nth(1).click();
    
    // Should show duplicate email error
    await expect(page.getByText(/already registered/i)).toBeVisible();
  });

  test('should trap focus within modal', async ({ page }) => {
    await page.getByRole('button', { name: /join waiting list/i }).click();
    
    // Tab through all focusable elements in modal
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/name \(optional\)/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email address/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/i agree to receive early-access emails/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /join waiting list/i }).nth(1)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByText('Cancel')).toBeFocused();
    
    // Tab should cycle back to first element
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/name \(optional\)/i)).toBeFocused();
  });
});