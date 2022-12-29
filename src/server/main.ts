import path from "path";
import { useAPI_LMS } from "./API_LMS";
import { useAPI_Quiz } from "./API_Quiz";
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
  return lti.redirect(res, "/deeplink");
});
lti.app.get("/deeplink", async (req, res) => {
  return res.sendFile(clientAppPath);
});

/* 




*/

useAPI_Quiz(lti.app);
useAPI_LMS(lti.app);
lti.app.get("*", (_req, res) => {
  return res.sendFile(clientAppPath);
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
