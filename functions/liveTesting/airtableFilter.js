const { Card } = require("dialogflow-fulfillment");
const functions = require("firebase-functions");
const requestLib = require("request");

var Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: `${process.env.AIRTABLE_KEY}`
});

var base = Airtable.base(process.env.AIRTABLE_ID);
function setPromise(agent) {
  return new Promise((response, reject) => {
    base("People")
      .select({
        view: "Grid view"
      })
      .eachPage(
        records => {
          let recordsArray = [];
          records.forEach(record => {
            let recordObj = {};
            recordObj.Name = record.get("Name");
            recordObj.Sector = record.get("Sector");
            recordObj.Attachments = record.get("Attachments");
            recordObj.photoLink = record.get("photoLink");
            recordObj.Position = record.get("Position");
            recordObj.Skills = record.get("Skills");
            recordObj.LinkedIn = record.get("LinkedIn");
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

function pingSlack(user, body) {
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

exports.testLookup = function(agent) {
  return setPromise(agent)
    .then(response => {
      const filteredRecords = response.filter(
        record => record.Sector.includes(agent.parameters.Sectors) === true
      );

      filteredRecords.forEach(record => {
        console.log("I am record AFTER FILTER: ", record);
      });
      pingSlack("TLNSJQLJC", {
        // username: "Joshua",
        // channel: "CMTHZ2QV9",
        channel: "TLNSJQLJC",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${response[3].Name}*`
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
        ],
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${response[1].Name}*`
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
    })
    .catch(err => agent.add(`${err}: I am the error in the catch`));
};

exports.testMe = function(agent) {
  return setPromise(agent)
    .then(response => {
      const filteredRecords = response.filter(
        record => record.Sector.includes(agent.parameters.Sectors) === true
      );

      filteredRecords.forEach(record => {
        console.log("I am record AFTER FILTER: ", record);
      });
      pingSlack("TLNSJQLJC", {
        // username: "Joshua",
        // channel: "CMTHZ2QV9",
        channel: "TLNSJQLJC",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${response[3].Name}*`
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
        ],
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${response[1].Name}*`
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
    })
    .catch(err => agent.add(`${err}: I am the error in the catch`));
};
