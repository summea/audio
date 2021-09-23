// ref: https://mochajs.org/
import assert from "assert"
import { convertSecToMin } from "../modules/utility.js"

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
