/**
 * Utility function to wait for a specified number of milliseconds
 * @param ms - Number of milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
