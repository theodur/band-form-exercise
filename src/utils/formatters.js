/**
 * Converts an amount in cents the dollar amount with two decimal points when applicable.
 *
 * @param {number} cents - The amount in cents
 * @returns {string} - The formatted dollar amount
 */
export function centsToDollars(cents) {
  if (typeof cents !== 'number') return '0';

  const dollars = (cents / 100).toFixed(2);

  // Check if the decimal part is '00' and return without decimals if true
  if (dollars.endsWith('.00')) {
    return dollars.split('.')[0]; // Return only the whole dollar part
  }

  return dollars;
}
