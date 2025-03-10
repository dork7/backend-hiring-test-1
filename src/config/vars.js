const path = require("path");

// import .env variables
require("dotenv-safe").config({
  path: path.join(__dirname, `../../.env`),
  sample: path.join(__dirname, "../../.env.example"),
  allowEmptyValues: true,
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri:
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI,
  },
};
