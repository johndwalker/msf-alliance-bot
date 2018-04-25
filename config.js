/******************************************************************************
 * config file parameters:
 * index.js:
 *      CommandoClient: ownerID (discord user ID, CommandClient constructor, 18-digit numerical string)
 *                      botToken (client.login, 59-character mixed-case string)
 * google.js:
 *      oAuth2Client: 	clientID (googleapi credentials, https://console.developers.google.com/apis/ 72 char)
 *                    	secret 24 char
 *                    	oauth redirect url 25 char
 *****************************************************************************/
var config = {};

config.commando = {};
config.google = {};

config.commando.ownerID = '';
config.commando.botToken = '';

config.google.clientID = '';
config.google.secret = '';
config.google.oauthURL = '';


module.exports = config;