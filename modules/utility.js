export function convertSecToMin(seconds) {
  let result = {
    "minutes": 0,
    "seconds": 0
  };
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Math
  result.minutes = Math.floor(seconds / 60);
  result.seconds = Math.floor(seconds);
  if (result.minutes > 0) {
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    //   /Reference/Operators/Remainder
    result.seconds = Math.floor(Math.round(seconds) % 60);
  }
  return result;
}
