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

Hook up API routes for our client app to get data from

*/

useAPI_Quiz(lti.app);
useAPI_LMS(lti.app);

/* 

Send client app for any other route

*/

lti.app.use((_req, res) => {
  sendClientHTML(res);
});

/* 
  
 
 
  
*/

const startServer = async () => {
  await lti.deploy({ port: Number(envVars.PORT) });

  /* 


  This is where we hook up platforms like Moodle, Canvas, Blackboard, etc.


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

startServer();
