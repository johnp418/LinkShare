const crypto = require("crypto-js");
const sha256 = crypto.SHA256;

const generateRandomString = () => crypto.lib.WordArray.random(32).toString();

const hash = arg => {
  return sha256(JSON.stringify(arg)).toString();
};

module.exports = {
  hash,
  generateRandomString
};
