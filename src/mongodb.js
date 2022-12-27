require("dotenv").config();

const MONGOHOST = process.env["MONGOHOST"];
const MONGOPASSWORD = process.env["MONGOPASSWORD"];
const MONGOPORT = process.env["MONGOPORT"];
const MONGOUSER = process.env["MONGOUSER"];

if (!(MONGOHOST && MONGOPASSWORD && MONGOPORT && MONGOUSER)) {
  throw "missing env vars";
}

const url = `mongodb://${MONGOUSER}:${MONGOPASSWORD}@${MONGOHOST}:${MONGOPORT}`;

module.exports = {
  MONGOHOST,
  MONGOPASSWORD,
  MONGOPORT,
  MONGOUSER,
  url,
};
