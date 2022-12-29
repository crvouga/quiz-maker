import path from "path";
import { useLMSRoutes } from "./routes.lms";
import { useQuizRoutes } from "./routes.quiz";
import { envVars, lti } from "./shared";

const clientAppPath = path.join(__dirname, "../../dist/index.html");

/* 
  
lti.onConnect fires when the LMS launches our app
so we'll send the client html app that will run inside of the LMS

*/
lti.onConnect((token, req, res) => {
  return res.sendFile(clientAppPath);
});

/* 
  
lti.onDeepLinking fires when the LMS launches our app for select specific content
so we'll send the client html app but with the /deeplink route so the client app knows
that it should render the deep linking view

*/
lti.onDeepLinking((token, req, res) => {
  // Call redirect function to deep linking view
  return lti.redirect(res, "/deeplink");
});
lti.app.get("/deeplink", async (req, res) => {
  return res.sendFile(clientAppPath);
});

/* 




*/

useQuizRoutes(lti.app);
useLMSRoutes(lti.app);
lti.app.get("*", (req, res) => {
  res.sendFile(clientAppPath);
});

/* 
  
 
  
*/

const main = async () => {
  await lti.deploy({ port: Number(envVars.PORT) });

  /* 


  This is where we hook up specific platforms like Moodle, Canvas, Blackboard, etc.


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

main();
