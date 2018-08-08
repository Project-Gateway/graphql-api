const express = require('express');
const app = express();
const axios = require('axios');
const { postgraphile } = require("postgraphile");

// set the configs based on the token
async function getPgSettings(req) {

  let bearer;
  let role = 'guest';
  let userId = null;

  if (bearer = req.headers.authorization) {

    try {
      const response = await axios.get('http://web/login-api/auth/validate', {
        headers: {
          'Authorization': bearer
        }
      });
      role = response.data.role;
      userId = response.data.sub;
    } catch (error) {
      // log the failed login try?
    }

  }

  return {
    role,
    'user.id': userId
  };
}

app.use(postgraphile("postgres://skyline:skyline@postgres:5432/skyline", 'public', {
    watchPg: true,
    dynamicJson: true,
    ignoreRBAC: false,
    pgSettings: getPgSettings
}));

app.listen(5000);
