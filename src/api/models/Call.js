const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");

const callSchema = new mongoose.Schema(
  {
    AccountSid: { type: String },
    ApiVersion: { type: String },
    CallSid: { type: String },
    CallStatus: { type: String },
    Called: { type: String },
    CalledCity: { type: String },
    CalledCountry: { type: String },
    CalledState: { type: String },
    CalledZip: { type: String },
    Caller: { type: String },
    CallerCity: { type: String },
    CallerCountry: { type: String },
    CallerState: { type: String },
    CallerZip: { type: String },
    Digits: { type: String },
    Direction: { type: String },
    From: { type: String },
    FromCity: { type: String },
    FromCountry: { type: String },
    FromState: { type: String },
    FromZip: { type: String },
    RecordingDuration: { type: String },
    RecordingSid: { type: String },
    RecordingUrl: { type: String },
    To: { type: String },
    ToCity: { type: String },
    ToCountry: { type: String },
    ToState: { type: String },
    ToZip: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Call", callSchema);
