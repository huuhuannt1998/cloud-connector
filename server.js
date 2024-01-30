"use strict";
const fs = require('fs')

/**
 * Express web server configured to host ST Schema connector
 */

require('dotenv').config();
const express = require('express')
const connector = require('./connector')

const PORT = process.env.PORT || 3000
const ACCESS_TOKEN_PREFIX = process.env.ACCESS_TOKEN_PREFIX;
const server = express();
server.use(express.json());

/* Only here for Glitch, so that GET doesn't return an error */
server.get('/', (req, res) => {
  res.send('Simple ST Schema example that creates two power supplies with custom capabilities and a multi-component outlet');
});

server.post('/', (req, res) => {
  if (accessTokenIsValid(req, res)) {
    connector.handleHttpCallback(req, res)
  }
});

function accessTokenIsValid(req, res) {
  // Replace with proper validation of issued access token. This version just checks for the
  // profix defined in the summy OAuth server
  if (req.body.authentication.token.startsWith(ACCESS_TOKEN_PREFIX)) {
    return true;
  }
  console.log('Unauthorized request')
  res.status(401).send('Unauthorized')
  return false;
}

let data = {}
if (fs.existsSync('./data.json')) {
    const json = fs.readFileSync('./data.json', 'UTF-8')
    console.log(`json = ${json}`)
    if (json) {
      data = JSON.parse(json)
    }
} else {
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'UTF-8')
}  
                          

server.listen(PORT);
console.log(`Server listening on http://127.0.0.1:${PORT}`);
