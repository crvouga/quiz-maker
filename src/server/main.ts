import { useAPI_LMS } from "./API_LMS";
import { useAPI_Quiz } from "./API_Quiz";
import { envVars, lti, sendClientHTML } from "./shared";

/*

lti.onConnect fires when the LMS launches our app
so we'll send the client html app that will run inside of the LMS

*/
lti.onConnect((token, req, res) => {
  console.log("[server] LMS launched");
  sendClientHTML(res);
  return;
});

/*

lti.onDeepLinking fires when the LMS launches our app for select specific content
so we'll send the client html app but with the /deeplink route so the client app knows
that it should render the deep linking view

*/
lti.onDeepLinking((token, req, res) => {
  console.log("[server] LMS launched deep linking");
  lti.redirect(res, "/deeplink");
  return;
});
lti.app.get("/deeplink", async (req, res) => {
  sendClientHTML(res);
  return;
});

/*

Hook up the API routes that our client app will consume

*/

useAPI_Quiz(lti.app);
useAPI_LMS(lti.app);

// lti.app.get("*", (_req, res) => {
//   sendClientHTML(res);
// });

/*




*/

const startServer = async () => {
  await lti.deploy({ port: Number(envVars.PORT) });

  /*


  This is where we hook up platforms like Moodle, Canvas, Blackboard, etc.


  */

  // await lti.registerPlatform({
  //   url: "http://localhost:8888/moodle",
  //   name: "Moodle",
  //   clientId: "zFADOCswVIf6d77",
  //   authenticationEndpoint: "http://localhost:8888/moodle/mod/lti/auth.php",
  //   accesstokenEndpoint: "http://localhost:8888/moodle/mod/lti/token.php",
  //   authConfig: {
  //     method: "JWK_SET",
  //     key: "http://localhost:8888/moodle/mod/lti/certs.php",
  //   },
  // });
  // console.log("registered moodle");

  // await lti.registerPlatform({
  //   url: "https://canvas.instructure.com",
  //   name: "Canvas Docker",
  //   clientId: "10000000000007",
  //   authenticationEndpoint: "http://canvas.docker/api/lti/authorize",
  //   accesstokenEndpoint: "http://canvas.docker/login/oauth2/token",
  //   authConfig: {
  //     method: "JWK_SET",
  //     key: "http://canvas.docker/api/lti/security/jwks",
  //   },
  // });
  // console.log("registered canvas.docker");

  await lti.registerPlatform({
    url: "https://canvas.instructure.com",
    name: "Canvas ASU Dev",
    clientId: "127470000000000262",
    authenticationEndpoint:
      "https://asu-dev.instructure.com//api/lti/authorize",
    accesstokenEndpoint: "https://asu-dev.instructure.com/login/oauth2/token",
    authConfig: {
      method: "JWK_SET",
      key: "https://asu-dev.instructure.com/api/lti/security/jwks",
    },
  });
  console.log("registered asu-dev.instructure.com");

  // await lti.registerPlatform({
  //   url: "https://canvas.instructure.com",
  //   name: "Canvas ASU Dev",
  //   clientId: "127470000000000262",
  //   authenticationEndpoint: "https://canvas-dev.asu.edu/api/lti/authorize",
  //   accesstokenEndpoint: "https://canvas-dev.asu.edu/login/oauth2/token",
  //   authConfig: {
  //     method: "JWK_SET",
  //     key: "https://canvas-dev.asu.edu/api/lti/security/jwks",
  //   },
  // });
  // console.log("registered https://canvas-dev.asu.edu");
};

startServer();
