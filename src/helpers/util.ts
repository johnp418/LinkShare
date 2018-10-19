import * as crypto from "crypto-js";
const sha256 = crypto.SHA256;

const generateRandomString = () => crypto.lib.WordArray.random(32).toString();

const hash = (arg: any) => {
  return sha256(JSON.stringify(arg)).toString();
};

export { hash, generateRandomString };
