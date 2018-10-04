const fs = require("fs");
const util = require("util");
const crypto = require("crypto");
const parse = require("bookmarks-parser");
const R = require("ramda");

const file = "sample.html";

const generateRandomString = () => crypto.randomBytes(32).toString("hex");

const sha256 = string => {
  return crypto
    .createHash("sha256")
    .update(string)
    .digest("hext");
};

const convert = (rootId, parentId, treeNode) => {
  const { type, title, children, url, add_date, last_modified } = treeNode;
  const nodeId = generateRandomString();
  const base = { rootId, parentId };

  // Folders are user specific, and bookmarks are universal
  if (type === "folder") {
    // For each child, build an object
    const childNodes = R.compose(
      R.reduce(
        (acc, curr) => {
          return { ...acc, ...curr };
        },
        { title }
      ),
      R.map(childNode => {
        return convert(rootId, parentId, childNode);
      })
    )(children);
  } else {
    const urlId = sha256(url);
  }
};

const flatten = (bookmarkTreeNodes, converter) => {
  // TODO: Handle root level urls...
  const rootId = generateRandomString();
  // bookmarkTreeNodes.map(treeNode => {
  //   return converter(rootId, null, treeNode);
  // })
};

parse(fs.readFileSync(file).toString(), (err, res) => {
  console.log(err);
  console.log(res.parser); // vendor name

  console.log("Length ", res.bookmarks.length);
  console.log(util.inspect(res.bookmarks, false, null, true));

  flatten(res.bookmarks);
});
