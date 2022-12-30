import dotenv from "dotenv";
import express from "express";
import ltijs from "ltijs";
import { MongoClient } from "mongodb";
import path from "path";
import { LineItem, LineItemGrade } from "../lti";
import { Result } from "../utils";

/* 


Env Vars

This is all the required env vars for the server to run


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

MongoDB is used as our primary database. It stores ltijs data and app specific data.

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

type LTI_Instance = InstanceType<typeof ltijs.Provider>;

export const lti: LTI_Instance =
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

export const createLineItem = async (
  idToken: ltijs.IdToken,
  lineItem: Omit<LineItem, "id">
): Promise<Result<string, LineItem>> => {
  // example use: https://gist.github.com/Cvmcosta/2a503dd3df6905cd635d26d188f99c13
  // @ts-ignore
  const created = await lti.Grade.createLineItem(idToken, lineItem);

  const parsed = LineItem.safeParse(created);

  if (!parsed.success) {
    return ["err", "failed to parse line item"];
  }

  return ["ok", parsed.data];
};

/* 




WARNING for Moodle users!

https://github.com/Cvmcosta/ltijs/issues/65

Make sure the user submitting the grade is enrolled in the course!
The admin user is not enrolled by default.





*/
export const submitScore = async ({
  idToken,
  grade,
  lineItemId,
}: {
  idToken: ltijs.IdToken;
  lineItemId: string;
  grade: LineItemGrade;
}): Promise<Result<string, LineItemGrade>> => {
  try {
    // example: https://gist.github.com/Cvmcosta/2a503dd3df6905cd635d26d188f99c13
    // @ts-ignore
    const submitted = await lti.Grade.submitScore(idToken, lineItemId, grade);

    const parsed = LineItemGrade.safeParse(submitted);

    if (!parsed.success) {
      return ["err", "failed to parse grade"];
    }

    return ["ok", parsed.data];
  } catch (error) {
    console.error(error);
    return ["err", String(error)];
  }
};
