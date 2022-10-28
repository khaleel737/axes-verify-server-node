const http = require('http');
const express = require('express');
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();

app.post('/start', (req, res) => {
  countryCode = req.query.country_code
  phoneNumber = req.query.phone_number
  via = req.query.via

  client.verify.services(process.env.VERIFY_SERVICE_SID)
    .verifications
    .create({to: `+${countryCode}${phoneNumber}`, channel: via})
    .then(resp => res.json(resp));
});


app.post('/check', (req, res) => {
  countryCode = req.query.country_code
  phoneNumber = req.query.phone_number
  code = req.query.verification_code

  client.verify.services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks
    .create({to: `+${countryCode}${phoneNumber}`, code: code})
    .then(resp => res.json(resp));
});

app.get('/', (req, res) => {
  var missing_env_variables = [];

  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log("ERROR! `TWILIO_ACCOUNT_SID` not set as env variable.");
    missing_env_variables.push('TWILIO_ACCOUNT_SID');
  }
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.log("ERROR! `TWILIO_AUTH_TOKEN` not set as env variable.");
    missing_env_variables.push('TWILIO_AUTH_TOKEN');
  }
  if (!process.env.VERIFY_SERVICE_SID) {
    console.log("ERROR! `VERIFY_SERVICE_SID` not set as env variable.");
    missing_env_variables.push('VERIFY_SERVICE_SID');
  }

  var message = missing_env_variables.length == 0 ? "All set!" : `Missing env variables: ${missing_env_variables.join(", ")}.`;
  console.log(message);
  res.json({
    "success": missing_env_variables.length == 0,
    "message": message
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on port 3000.');
});
