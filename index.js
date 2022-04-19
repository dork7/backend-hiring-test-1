const accountSid = "AC7b2e3b1e6cb727fe8f47bf72ff668765";
const authToken = "bfb97141ad5cf21c54afb974b00c8746";
const express = require("express");
const app = express();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const urlencoded = require("body-parser").urlencoded;
app.use(urlencoded({ extended: false }));

const client = require("twilio")(accountSid, authToken);

// client.calls.create(
//   {
//     url: "http://demo.twilio.com/docs/voice.xml",
//     to: "+923455293564",
//     from: "+15412756868",
//   },
//   (err, call) => {
//     if (err) console.log("Error while making call", err);
//     else console.log("Called to ->", call.sid);
//   }
// );

app.post("/voice", (req, res) => {
  try {
    const twiml = new VoiceResponse();

    const gather = twiml.gather({
      numDigits: 1,
      action: "/gather",
    });
    gather.say(
      "For personal number, press 1. Press 2, to drop a voice message"
    );

    // If the user doesn't enter input, loop
    twiml.redirect("/voice");

    // Render the response as XML in reply to the webhook request
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.log("Error in voice", error);
  }
});

// Create a route that will handle <Gather> input
app.post("/gather", (request, response) => {
  try {
    // Use the Twilio Node.js SDK to build an XML response
    console.log("request.body", request.body);
    const twiml = new VoiceResponse();

    // If the user entered digits, process their request
    if (request.body.Digits) {
      switch (request.body.Digits) {
        case "1":
          twiml.say("Redirecting to personal number");
          twiml.redirect("/forward_call");
          //   twiml.dial("+9233150529331");
          break;
        case "2":
          twiml.say("You selected voice message!");
          //   twiml.redirect("/voice");
          break;
        default:
          twiml.say("Sorry, I don't understand that choice.");
          twiml.pause();
          twiml.redirect("/voice");
          break;
      }
    } else {
      // If no input was sent, redirect to the /voice route
      twiml.redirect("/voice");
    }

    // Render the response as XML in reply to the webhook request
    response.type("text/xml");
    response.send(twiml.toString());
  } catch (error) {
    console.log("error", error);
  }
});

app.get("/forward_call", (request, response) => {
  console.log("here in fwding");
  const twilio = new VoiceResponse();
  twilio.dial("+9233150529331");
  response.set("Content-Type", "text/xml");
  response.send(twilio.toString());
});

app.get("/", (req, res) => {
  res.send("hello testing");
});

app.listen(7878, () => console.log("Listening on port 7878"));
