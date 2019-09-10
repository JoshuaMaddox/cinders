const { Card } = require("dialogflow-fulfillment");
const functions = require("firebase-functions");

var Airtable = require("airtable");

const airtable = {
  id: "appdbGvXOjvqS2yIM",
  key: "keyMUyNui5KgC4fu9"
};

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: `${airtable.key}`
});

var base = Airtable.base(airtable.id);
//REENACT AFTER TESTING LOCALLY
// Airtable.configure({
//   endpointUrl: "https://api.airtable.com",
//   apiKey: `${functions.config().airtable.key}`
// });

// var base = Airtable.base(functions.config().airtable.id);

// function setPromise(agent) {
//   return new Promise((res, rej) => {
//     res(agent => {
//       base("Resources")
//         .select({
//           view: "Grid view"
//         })
//         .eachPage(records => {
//           console.log("I AM THE RECORDS: in airtableHeleper.js ", records);
//           let recordsArray = [];
//           records.forEach(record => {
//             let recordObj = {};
//             recordObj.Title = record.get("Title");
//             recordObj.Description = record.get("Description");
//             recordObj.URL = record.get("URL");
//             recordsArray.push(recordObj);
//           });
//           console.log(
//             "I AM THE RECORDS ARRAY IN AIRTABLEHELPER.JS: ",
//             recordsArray
//           );
//           if (!recordsArray[0]) {
//             rej(err => agent.add(`Sorry Babes. The request failed.`));
//           }
//           return recordsArray;
//         });
//     });
//   });
// }

function setPromise(agent) {
  console.log("setPromise was called!!!!!");
  return new Promise((res, rej) => {
    base("Resources")
      .select({
        view: "Grid view"
      })
      .eachPage((records, err) => {
        console.log("I AM THE RECORDS: in airtableHeleper.js ", records);
        console.log("RECORDS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        let recordsArray = [];
        records.forEach(record => {
          let recordObj = {};
          recordObj.Title = record.get("Title");
          recordObj.Description = record.get("Description");
          recordObj.URL = record.get("URL");
          recordsArray.push(recordObj);
        });
        console.log(
          "I AM THE RECORDS ARRAY IN AIRTABLEHELPER.JS: ",
          recordsArray
        );
        res(recordsArray);
        rej(err);
      });
  });
}

exports.react = function(agent) {
  console.log("V3 WAS CALLEd JOSHUA");
  return setPromise(agent)
    .then(recordsArray => {
      console.log("I am the recordsArray in airtableHelper.js: ", recordsArray);
      recordsArray.forEach(record => {
        agent.add(
          new Card({
            title: record.Title,
            imageUrl: "https://developers.google.com/actions/assistant.png",
            text: record.Description,
            buttonText: "Go To Article",
            buttonUrl: record.URL
          })
        );
      });
    })
    .catch(err => `${err}: I am the error`);
};
