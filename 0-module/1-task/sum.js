function sum(a, b) {
  /* ваш код */
  if (typeof a !== 'number' || typeof b !== 'number') {throw new TypeError; return; }
  return a + b;
}

module.exports = sum;
