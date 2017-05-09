var google = require('googleapis');
var googleAuth = require('google-auth-library')
var auth = new googleAuth();

var oauth2Client = new auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL[0]
);

module.exports = oauth2Client;