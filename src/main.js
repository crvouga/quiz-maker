require("dotenv").config();
const path = require("path");
const lti = require("./lti");
const quiz = require("./quiz");
const mongo = require("./mongo");
const ltijs = require("ltijs").Provider;

const clientAppDistPath = path.join(__dirname, "../client/dist");

// Setup
ltijs.setup(
  process.env["LTI_KEY"],
  {
    url: mongo.url,
    connection: { user: mongo.MONGOUSER, pass: mongo.MONGOPASSWORD },
  },
  {
    staticPath: clientAppDistPath, // Path to static files
    cookies: {
      secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
      sameSite: "", // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    },
    devMode: true, // Set DevMode to true if the testing platform is in a different domain and https is not being used
  }
);

// When receiving successful LTI launch redirects to app
ltijs.onConnect(async (token, req, res) => {
  res.sendFile(path.join(clientAppDistPath, "/index.html"));
  return;
});

// When receiving deep linking request redirects to deep screen
ltijs.onDeepLinking(async (token, req, res) => {
  ltijs.redirect(res, "/deeplink", { newResource: true });
  return;
});

// Setting up routes
ltijs.app.use(lti.router);
ltijs.app.use(quiz.router);

// Setup function
const setup = async () => {
  await ltijs.deploy({ port: process.env.PORT });

  /**
   * Register platform
   */
  await ltijs.registerPlatform({
    url: "http://localhost:8888/moodle",
    name: "Moodle",
    clientId: "zTn6FWnZ4W21zmS",
    authenticationEndpoint: "http://localhost:8888/moodle/mod/lti/auth.php",
    accesstokenEndpoint: "http://localhost:8888/moodle/mod/lti/token.php",
    authConfig: {
      method: "JWK_SET",
      key: "http://localhost:8888/moodle/mod/lti/certs.php",
    },
  });
};

setup();
