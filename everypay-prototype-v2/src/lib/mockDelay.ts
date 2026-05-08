/**
 * Simulates network latency for mock API calls.
 *
 * @param ms - Base delay in milliseconds. If not provided, uses random jitter (300-800ms).
 * @returns Promise that resolves after the specified delay.
 *
 * In test mode (NODE_ENV === 'test'), returns immediately with no delay.
 */
export async function mockDelay(ms?: number): Promise<void> {
  if (process.env.NODE_ENV === 'test') return;

  const delay = ms ?? Math.floor(Math.random() * 100) + 50;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
