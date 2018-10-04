const util = require("util");
const data = require("./data");

describe("Parser", () => {
  const tree = util.inspect(data, false, null, true);
  console.log("Tree ", tree);

  it("Builds correct object", () => {
    expect(1).toBe(2);
  });
});
