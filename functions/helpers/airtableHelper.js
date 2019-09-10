const { Card } = require("dialogflow-fulfillment");
const functions = require("firebase-functions");
const requestLib = require("request");

var Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: `${functions.config().airtable.key}`
});

var base = Airtable.base(functions.config().airtable.id);

function setPromise(agent) {
  return new Promise((response, reject) => {
    base("Resources")
      .select({
        view: "Grid view"
      })
      .eachPage(
        records => {
          let recordsArray = [];
          records.forEach(record => {
            let recordObj = {};
            recordObj.Title = record.get("Title");
            recordObj.Description = record.get("Description");
            recordObj.URL = record.get("URL");
            recordsArray.push(recordObj);
          });
          response(recordsArray);
        },
        function done(err) {
          if (err) {
            console.error("I am the error in Done: ", err);
            reject(err);
            return;
          }
        }
      );
  });
}

// exports.react = function(agent) {
//   return setPromise(agent)
//     .then(response => {
//       console.log("I am the response in airtableHelper.js: ", response);
//       response.forEach(record => {
//         return agent.add(
//           new Card({
//             title: record.Title,
//             imageUrl:
//               "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
//             text: record.Description,
//             buttonText: "This is a button",
//             buttonUrl: record.URL
//           })
//         );
//       });
//     })
//     .catch(err => agent.add(`${err}: I am the error in the catch`));
// };

function pingSlack(user, body) {
  // let slackMessageBody = {
  //   username: "Joshua",
  //   text: "Hi Joshua. This is a message from Cinders, your friendly Slack bot",
  //   icon_emoji: ":tada:"
  // };
  requestLib.post(
    {
      headers: { "content-type": "application/json" },
      url:
        "https://hooks.slack.com/services/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",
      body: JSON.stringify(body)
    },
    function(error, response, body) {
      console.log(
        "Slack notification response body: " +
          JSON.stringify(body) +
          ", error: " +
          error
      );
    }
  );
}

exports.react = function(agent) {
  return setPromise(agent)
    .then(response => {
      console.log("I am the response in airtableHelper.js: ", response);
      pingSlack("joshua", {
        username: "Joshua",
        // channel: "CMTHZ2QV9",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Jo-Ann Tan*"
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
              text: "*Last Known Position:* Director at Acumen Academy"
            }
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*Visit Jo-Ann's LinkedIn Profile:* <https://www.linkedin.com/in/jo-ann-tan/>"
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
                text: ":heavy_check_mark: Workforce Development",
                emoji: true
              },
              {
                type: "plain_text",
                text: ":heavy_check_mark: Education",
                emoji: true
              },
              {
                type: "plain_text",
                text: ":heavy_check_mark: Lean Data",
                emoji: true
              },
              {
                type: "plain_text",
                text: ":heavy_check_mark: Systems Practice",
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
              text: "Network With Jo-Ann"
            },
            accessory: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Take Action",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Ask to Contact",
                    emoji: true
                  },
                  value: "value-0"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Save To Contacts",
                    emoji: true
                  },
                  value: "value-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Invite to Course",
                    emoji: true
                  },
                  value: "value-2"
                }
              ]
            }
          }
        ]
      });

      response.forEach(record => {
        let body = {
          title: record.Title,
          text: "Hey <@joshua>, did you see my file?",
          imageUrl:
            "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
          buttonText: "Hi",
          buttonUrl: record.URL
        };
        return agent.add(
          new Card({
            title: record.Title,
            imageUrl:
              "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
            text: record.Description,
            buttonText: "This is a button",
            buttonUrl: record.URL
          })
        );
      });
    })
    .catch(err => agent.add(`${err}: I am the error in the catch`));
};
