// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
//https://github.com/dialogflow/dialogflow-fulfillment-nodejs/issues/146
//https://stackoverflow.com/questions/56641489/how-do-i-use-slack-blocks-from-dialogflow-fullfillment

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion, Payload } = require("dialogflow-fulfillment");

// const react = require("./helpers/airtableHelper.js");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });

    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`This is from the fallback in our dialogflow Function`);
    }

    function slackPayloadTest(agent) {
      console.log("TESTING THE PAYLOAD ONE");
      let payload = {
        attachments: [
          {
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Jo-Ann Tan: :US:*"
                }
              },
              {
                type: "image",
                title: {
                  type: "plain_text",
                  text: "Example Image",
                  emoji: true
                },
                image_url:
                  "https://www.plusacumen.org/sites/default/files/fpp/Jo-Ann%20Tan_600.jpg",
                alt_text: "Example Image"
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Last Known Position:* Director at Acumen"
                }
              },
              {
                type: "divider"
              },
              {
                type: "section",
                fields: [
                  {
                    type: "plain_text",
                    text: ":black_small_square: Workforce Development",
                    emoji: true
                  },
                  {
                    type: "plain_text",
                    text: ":black_small_square: Adaptive Leadership",
                    emoji: true
                  },
                  {
                    type: "plain_text",
                    text: ":black_small_square: Human-Centered Design",
                    emoji: true
                  },
                  {
                    type: "plain_text",
                    text: ":black_small_square: Lean Startup",
                    emoji: true
                  }
                ]
              },
              {
                type: "divider"
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text:
                    "*Connect with Jo-Ann: * <https://www.linkedin.com/in/jo-ann-tan/| View Profile on Acumen Academy>"
                }
              }
              // {
              //   type: "actions",
              //   elements: [
              //     {
              //       type: "button",
              //       text: {
              //         type: "plain_text",
              //         text: "Ask To Connect",
              //         emoji: true
              //       },
              //       value: "Ask To Connect"
              //     },
              //     {
              //       type: "button",
              //       text: {
              //         type: "plain_text",
              //         text: "Save to Contacts",
              //         emoji: true
              //       },
              //       value: "Quick Contact"
              //     },
              //     {
              //       type: "button",
              //       text: {
              //         type: "plain_text",
              //         text: "Invite To Course",
              //         emoji: true
              //       },
              //       value: "Invite To Course"
              //     }
              //   ]
              // }
            ]
          }
        ]
      };
      agent.add(new Suggestion(`Ask To Connect`));
      agent.add(new Suggestion(`Save to Contacts`));
      agent.add(new Suggestion(`Invite To Course`));
      agent.add(new Payload(agent.SLACK, payload));
    }

    function slackPayloadTestTwo(agent) {
      console.log("TESTING THE PAYLOAD");
      // agent.add("How's it going?");
      agent.add(
        new Card({
          title: `Title: this is a card title`,
          imageUrl:
            "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
          text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
          buttonText: "This is a button",
          buttonUrl: "https://assistant.google.com/"
        })
      );
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
    intentMap.set("React", slackPayloadTest);
    intentMap.set("askToContact", slackPayloadTestTwo);

    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
  }
);
