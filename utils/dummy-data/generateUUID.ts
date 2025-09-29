/**
 * Generates a UUID (Universally Unique Identifier) in the format of
 * `xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx`.
 *
 * The UUID is generated using random numbers and follows the version 4 UUID
 * specification, where the 13th character is always "4" and the 17th character
 * is one of "8", "9", "A", or "B".
 *
 * Note: This implementation uses `Math.random()` for randomness, which is not
 * cryptographically secure. For secure UUID generation, consider using a library
 * like `crypto` or `uuid`.
 *
 * @returns {string} A randomly generated UUID string.
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
