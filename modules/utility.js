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

export function getCurrentSongTimeDisplay(currentTime) {
  let ctPieces = convertSecToMin(currentTime);
  let minWithPad = ctPieces.minutes;
  if (ctPieces.minutes < 10) {
    minWithPad = "0" + ctPieces.minutes;
  }
  let secWithPad = ctPieces.seconds;
  if (ctPieces.seconds < 10) {
    secWithPad = "0" + ctPieces.seconds;
  }
  return minWithPad+":"+secWithPad+"&nbsp;";
}

export function getCurrentSongTimeLengthDisplay(currentTime, songLength) {
  let ctlPieces = convertSecToMin(songLength - currentTime);
  let minLeftWithPad = ctlPieces.minutes;
  if (ctlPieces.minutes < 10) {
    minLeftWithPad = "0" + ctlPieces.minutes;
  }
  let secLeftWithPad = ctlPieces.seconds;
  if (ctlPieces.seconds < 10) {
    secLeftWithPad = "0" + ctlPieces.seconds;
  }
  if (songLength > 0 && currentTime != songLength) {
    return "-"+minLeftWithPad+":"+secLeftWithPad;
  }
  return "&nbsp;00:00";
}
