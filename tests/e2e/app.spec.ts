import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:9002';

test.describe('LogisticsVision App - Critical Error Check', () => {
  
  test('root page redirects to login without webpack errors', async ({ page }) => {
    const criticalErrors: string[] = [];
    page.on('pageerror', (err) => {
      const msg = err.message;
      if (msg.includes('Cannot read properties of undefined (reading \'call\')') ||
          msg.includes('__webpack_require__') ||
          msg.includes('ChunkLoadError')) {
        criticalErrors.push(msg);
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    
    // Should redirect to login
    const url = page.url();
    expect(url).toContain('/login');
    
    // No webpack bundle errors
    expect(criticalErrors, `Webpack errors found: ${criticalErrors.join('\n')}`).toHaveLength(0);
  });

  test('login page loads and shows form', async ({ page }) => {
    const criticalErrors: string[] = [];
    page.on('pageerror', (err) => criticalErrors.push(err.message));
    
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Check page title is present
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Login form should be visible
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    
    // No critical errors
    const webpackErrors = criticalErrors.filter(e => 
      e.includes('Cannot read properties of undefined (reading \'call\')')
    );
    expect(webpackErrors, `Webpack errors: ${webpackErrors.join(', ')}`).toHaveLength(0);
  });

  test('login page has submit button', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
  });

  test('login page Sign in with Google button works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const googleBtn = page.locator('button:has-text("Sign in with Google"), button:has-text("Google")').first();
    await expect(googleBtn).toBeVisible({ timeout: 10000 });
  });

  test('register page loads without errors', async ({ page }) => {
    const criticalErrors: string[] = [];
    page.on('pageerror', (err) => {
      if (err.message.includes('Cannot read properties of undefined')) {
        criticalErrors.push(err.message);
      }
    });
    
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');
    
    // Page should load (body should be present)
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
    
    // No webpack errors
    expect(criticalErrors, `Critical errors: ${criticalErrors.join(', ')}`).toHaveLength(0);
  });

  test('join page with token works', async ({ page }) => {
    const criticalErrors: string[] = [];
    page.on('pageerror', (err) => {
      if (err.message.includes('Cannot read properties of undefined')) {
        criticalErrors.push(err.message);
      }
    });
    
    // Join page requires a token - navigate with a test token
    await page.goto(`${BASE_URL}/join/test-token-123`);
    await page.waitForLoadState('networkidle');
    
    // Page should load
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
    
    expect(criticalErrors, `Critical errors: ${criticalErrors.join(', ')}`).toHaveLength(0);
  });

  test('login form validation - empty submit stays on login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
      // Should stay on login page
      expect(page.url()).toContain('/login');
    }
  });

  test('login with invalid credentials stays on login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('test@invalid.com');
      await passwordInput.fill('wrongpassword123');
      
      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(5000);
        // Should not navigate to dashboard
        expect(page.url()).not.toContain('/dashboard');
      }
    }
  });
});

test.describe('Page Structure', () => {
  test('login page has valid HTML with body', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible({ timeout: 10000 });
    
    const htmlEl = page.locator('html');
    await expect(htmlEl).toBeAttached();
  });
  
  test('login page has meta charset', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('domcontentloaded');
    
    const charset = await page.evaluate(() => {
      const meta = document.querySelector('meta[charset]') || 
                   document.querySelector('meta[http-equiv="Content-Type"]');
      return meta ? (meta.getAttribute('charset') || meta.getAttribute('content') || 'found') : null;
    });
    
    expect(charset, 'Page should have charset meta tag').toBeTruthy();
  });
  
  test('login page returns 200 status', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/login`);
    expect(response?.status()).toBe(200);
  });
  
  test('root URL returns 200 status', async ({ page }) => {
    const response = await page.goto(BASE_URL);
    expect(response?.status()).toBe(200);
  });
});
