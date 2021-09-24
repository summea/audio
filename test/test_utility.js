// ref: https://mochajs.org/
import assert from "assert"
import {
  convertSecToMin,
  getCurrentSongTimeDisplay,
  getCurrentSongTimeLengthDisplay
} from "../modules/utility.js"

describe('convertSecToMin', function() {
  it('Should show 1 minute when given 60 seconds', function() {
    let result = convertSecToMin(60);
    assert.equal(result["minutes"], 1);
    assert.equal(result["seconds"], 0);
  });
  it('Should show 2 minutes when given 120 seconds', function() {
    let result = convertSecToMin(120);
    assert.equal(result["minutes"], 2);
    assert.equal(result["seconds"], 0);
  });
  it('Should show 3 minutes when given 180 seconds', function() {
    let result = convertSecToMin(180);
    assert.equal(result["minutes"], 3);
    assert.equal(result["seconds"], 0);
  });
  it('Should show 1 second when given 1 second', function() {
    let result = convertSecToMin(1);
    assert.equal(result["minutes"], 0);
    assert.equal(result["seconds"], 1);
  });
});

describe('getCurrentSongTimeDisplay', function() {
  it('Should show time display of 00:00 when currentTime is 0', function() {
    let result = getCurrentSongTimeDisplay(0);
    assert.equal(result, "00:00&nbsp;");
  });
  it('Should show time display of 00:01 when currentTime is 1', function() {
    let result = getCurrentSongTimeDisplay(1);
    assert.equal(result, "00:01&nbsp;");
  });
  it('Should show time display of 01:00 when currentTime is 60', function() {
    let result = getCurrentSongTimeDisplay(60);
    assert.equal(result, "01:00&nbsp;");
  });
});

describe('getCurrentSongTimeLengthDisplay', function() {
  it('Should show time display of 00:00 when currentTime is 0', function() {
    let result = getCurrentSongTimeLengthDisplay(60, 60);
    assert.equal(result, "&nbsp;00:00");
  });
  it('Should show time display of -00:01 when currentTime is 1', function() {
    let result = getCurrentSongTimeLengthDisplay(1, 60);
    assert.equal(result, "-00:59");
  });
  it('Should show time display of -01:00 when currentTime is 60', function() {
    let result = getCurrentSongTimeLengthDisplay(59, 60);
    assert.equal(result, "-00:01");
  });
});
