const util = require("util");
const { flatten } = require("../bookmark-parser");
const { hash } = require("../util");
const data = require("./data");
const processed = require("./data-formatted");

describe("Parser", () => {
  const tree = util.inspect(data, false, null, true);
  // console.log("Tree ", tree);
  // console.log("Expect ", util.inspect(formatted, false, null, true));

  it("Builds correct tree data", () => {
    const [tree, urlMap] = flatten("rootUniqueId", data);
    expect(tree).toEqual(processed.tree);
    expect(urlMap).toEqual(processed.url);
  });
});

describe(`test custom hash function`, () => {
  it("Should always generate same hash for a string input", () => {
    expect(hash("https://google.com")).toBe(
      "05046f26c83e8c88b3ddab2eab63d0d16224ac1e564535fc75cdceee47a0938d"
    );
    expect(hash("reactjs.com")).toBe(
      "b27efc01b1c3881a1683dfaa830f076cb3091b25d02f23953e4ca9e9d1196516"
    );
  });

  it("Should always generate same hash for an object", () => {
    const o = {
      type: "folder",
      title: "B",
      children: [
        { type: "bookmark", title: "C*", url: "curl", add_date: 1538612131234 }
      ]
    };
    expect(hash(o)).toBe(
      "939443c45eef9373962ee074233b8d3ff37fbd2380ab8aaabf1ec51fb36c2811"
    );
  });
});
