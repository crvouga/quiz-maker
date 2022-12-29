import dotenv from "dotenv";
import ltijs from "ltijs";
import { MongoClient } from "mongodb";
import path from "path";
import express from "express";

/* 


Env Vars


*/

dotenv.config({
  path: path.join(__dirname, "../../.env.server"),
});

const MONGOHOST = process.env["MONGOHOST"];

if (!MONGOHOST) {
  throw "missing MONGOHOST env var";
}

const MONGOPASSWORD = process.env["MONGOPASSWORD"];

if (!MONGOPASSWORD) {
  throw "missing MONGOPASSWORD env var";
}

const MONGOPORT = process.env["MONGOPORT"];

if (!MONGOPORT) {
  throw "missing MONGOPORT env var";
}

const MONGOUSER = process.env["MONGOUSER"];

if (!MONGOUSER) {
  throw "missing MONGOUSER env var";
}

const LTI_KEY = process.env["LTI_KEY"];

if (!LTI_KEY) {
  throw "missing LTI_KEY env var";
}

const PORT = process.env.PORT;

if (!PORT) {
  throw "missing PORT env var";
}

export const envVars = {
  MONGOHOST,
  MONGOPASSWORD,
  MONGOPORT,
  MONGOUSER,
  LTI_KEY,
  PORT,
};

/* 


MongoDB Instance


*/

const mongoUrl = `mongodb://${MONGOUSER}:${MONGOPASSWORD}@${MONGOHOST}:${MONGOPORT}`;

const client = new MongoClient(mongoUrl);

client.on("open", () => {
  console.log("[mongodb] connection open");
});

client.on("close", () => {
  console.log("[mongodb] connection closed");
});

export const db = client.db("learning-tool");

/* 


Client Side App HTML



*/

const clientAppHTML_Path = path.join(__dirname, "..", "..", "dist");

export const sendClientHTML = (res: express.Response) => {
  return res.sendFile(path.join(clientAppHTML_Path, "index.html"));
};

/* 


LTI Instance

This is the ltijs instance that we'll use to handle LTI requests

WARNING! The types provided by @types/ltijs do not match the actual ltijs library.


*/

type LtiInstance = InstanceType<typeof ltijs.Provider>;

export const lti: LtiInstance =
  // @ts-ignore
  ltijs.Provider;

// @ts-ignore
lti.setup(
  LTI_KEY,
  {
    url: mongoUrl,
    connection: { user: MONGOUSER, pass: MONGOPASSWORD },
  },
  {
    staticPath: clientAppHTML_Path, // Path to static files
    cookies: {
      secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
      sameSite: "", // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    },
    // devMode: true, // Set DevMode to true if the testing platform is in a different domain and https is not being used
  }
);
