const express = require("express");
const accountSid = "AC7b2e3b1e6cb727fe8f47bf72ff668765";
const authToken = "bfb97141ad5cf21c54afb974b00c8746";
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const router = express.Router();
const CallSchema = require("../models/call");

router.get("/test", (req, res) => res.send("OK"));
router.get("/get-records", async (req, res) => {
  const resp = await CallSchema.find(
    {},
    "CallStatus From RecordingUrl To RecordingDuration Direction"
  );
  res.send({ records: resp, error: false });
});

// added web hook for this endpoint in twilio
router.post("/voice", (req, res) => {
  try {
    const twiml = new VoiceResponse();

    const gather = twiml.gather({
      numDigits: 1,
      action: "/gather",
    });
    gather.say(
      "For personal number, press 1. Press 2, to drop a voice message"
    );
    twiml.redirect("/voice");
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.log("Error in voice", error);
  }
});

router.post("/gather", (request, response) => {
  try {
    const twiml = new VoiceResponse();
    console.log("request.body", request.body);
    // If the user entered digits, process their request
    if (request.body.Digits) {
      switch (request.body.Digits) {
        case "1":
          twiml.say("Redirecting to personal number");
          //redirecting user call to personal number
          return response.redirect("/forward_call");
        case "2":
          twiml.say("You selected voice message!");
          //redirecting user call to voice message
          return response.redirect("/voice_message");
        default:
          twiml.say("Sorry, I don't understand that choice.");
          break;
      }
    } else {
      twiml.redirect("/voice");
    }

    response.type("text/xml");
    response.send(twiml.toString());
  } catch (error) {
    console.log("error in gather", error);
  }
});

router.get("/forward_call", async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const dial = twiml.dial({
      action: "/hangup?callStatus=agentCall",
    });
    dial.number("+923455293564");
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.log(error);
  }
});

router.get("/voice_message", (req, res) => {
  try {
    const twiml = new VoiceResponse();
    twiml.say(
      "Please leave a message after the beep. press # to end the message"
    );

    twiml.record({
      action: "/hangup?callStatus=voiceMessage",
      finishOnKey: "#",
    });
    twiml.hangup();
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.log(error);
  }
});

router.post("/hangup", async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    twiml.say("thank you for contacting us.");
    twiml.hangup();

    // saving the call details in database
    let call = new CallSchema({ ...req.body });
    await call.save();
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
