import { setTimeout } from 'node:timers/promises';

import { describe, it, expect, beforeAll } from 'vitest';

const SERVER_URL = new URL('http://localhost:3000/');

const READINESS_CHECK_TIMEOUT_MS = 500;
const READINESS_CHECK_INTERVAL_MS = 1000;
const READINESS_CHECK_MAX_ATTEMPTS = 5;

async function waitForServerToBeReady(): Promise<void> {
  let attempts = 0;
  let lastError = '';

  while (attempts < READINESS_CHECK_MAX_ATTEMPTS) {
    attempts += 1;

    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(SERVER_URL, {
        signal: AbortSignal.timeout(READINESS_CHECK_TIMEOUT_MS),
      });

      if (response.status === 404) {
        return;
      }

      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = (error as Error).message;
    }

    // eslint-disable-next-line no-await-in-loop
    await setTimeout(READINESS_CHECK_INTERVAL_MS);
  }

  const checkTimeout = READINESS_CHECK_INTERVAL_MS * READINESS_CHECK_MAX_ATTEMPTS;

  throw new Error(`Server not ready after ${checkTimeout}ms: ${lastError}`);
}

describe('Smoke tests', () => {
  beforeAll(waitForServerToBeReady);

  it('should require an audience', async () => {
    const response = await fetch(SERVER_URL, { method: 'POST' });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: /audience/,
    });
  });
});
