// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

if (!('randomUUID' in window.crypto)) {
// https://stackoverflow.com/a/2117523/2800218
// LICENSE: https://creativecommons.org/licenses/by-sa/4.0/legalcode
  window.crypto.randomUUID = function randomUUID() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
      // eslint-disable-next-line no-mixed-operators
      (ch) => (ch ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> ch / 4).toString(16)
    )
  }
}
