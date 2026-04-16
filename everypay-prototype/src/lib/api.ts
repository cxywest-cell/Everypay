import { mockDelay } from "./mockDelay";

const ERROR_RATE_TIMEOUT = 0.05; // 5%
const ERROR_RATE_500 = 0.02; // 2%

/**
 * Placeholder for a client-side mock fetch.
 * In practice, Next.js Route Handlers read seed files directly via readSeed(),
 * so this function is not used. Kept for potential future client-side mocking.
 */
export async function mockFetch<T>(): Promise<T> {
  // Simulate network latency
  await mockDelay();

  // Simulate errors
  const rand = Math.random();
  if (rand < ERROR_RATE_TIMEOUT) {
    throw new Error("Request timeout");
  }
  if (rand < ERROR_RATE_TIMEOUT + ERROR_RATE_500) {
    throw new Error("Internal server error");
  }

  // In a real app this would be a fetch call.
  // For Next.js Route Handlers, the handler reads the seed file directly.
  // This function is kept for client-side mock calls if needed.
  throw new Error("mockFetch should not be called directly in Route Handlers. Use fs.readFileSync instead.");
}

export { mockDelay };
