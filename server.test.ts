import { describe, it, expect } from 'vitest';

const SERVER_URL = new URL('http://localhost:3000/');

describe('Smoke tests', () => {
  it('should require an audience', async () => {
    const response = await fetch(SERVER_URL, { method: 'POST' });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: /audience/,
    });
  });
});
