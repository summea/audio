// ref: https://mochajs.org/
import assert from "assert"
import { convertSecToMin } from "../modules/utility.js"

describe('convertSecToMin', function() {
  it('Should show 1 minute when given 60 seconds', function() {
    let result = convertSecToMin(60);
    assert.equal(result["minutes"], 1);
    assert.equal(result["seconds"], 0);
  });
});
