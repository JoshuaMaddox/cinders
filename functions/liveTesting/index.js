// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues

const airtable = {
  id: "appdbGvXOjvqS2yIM",
  key: "keyMUyNui5KgC4fu9"
};

const express = require("express");
const app = express();

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

const react = require("./helpers/airtableHelper.js");
// import react from "./helpers/airtableHelper";

app.get("/", (req, res) => res.send("online"));

//REENACT AFTER TESTING LOCALLY
// process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

app.post("/dialogflow", express.json(), (req, res) => {
  //REENACT AFTER TESTING LOCALLY
  //   exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  //     (request, response) => {
  const agent = new WebhookClient({ request: req, response: res });
  // console.log(
  //   "I AM Dialogflow Request headers: " + JSON.stringify(request.headers)
  // );
  // console.log(
  //   "I AM Dialogflow Request body: " + JSON.stringify(request.body)
  // );

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`This is from the fallback in our dialogflow Function`);
  }

  //   function reactTest(agent) {
  //     agent.add("The local test environment is working AMAZNIG!");
  //   }

  //https://cloud.google.com/dialogflow/docs/tutorials/build-an-agent/create-fulfillment-using-webhook

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("React", react.react);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
//REENACT AFTER TESTING LOCALLY
// });

app.listen(process.env.PORT || 8080);