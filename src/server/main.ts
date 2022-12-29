import path from "path";
import { useLMSRoutes } from "./routes.lms";
import { useQuizRoutes } from "./routes.quiz";
import { envVars, lti } from "./shared";

const clientHtml = path.join(__dirname, "../../dist/index.html");

// LMS launches our app
lti.onConnect((token, req, res) => {
  return res.sendFile(clientHtml);
});

// When receiving deep linking request redirects to deep screen
lti.onDeepLinking((token, req, res) => {
  // Call redirect function to deep linking view
  return lti.redirect(res, "/deeplink");
});
lti.app.get("/deeplink", async (req, res) => {
  return res.sendFile(clientHtml);
});

// Setting up routes
useQuizRoutes(lti.app);
useLMSRoutes(lti.app);

// Wildcard route to deal with redirecting to React routes
lti.app.get("*", (req, res) => {
  res.sendFile(clientHtml);
});

const setup = async () => {
  await lti.deploy({ port: Number(envVars.PORT) });

  /**
   * Register platform
   */
  await lti.registerPlatform({
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
