/******************************************************************************
 * todo:
 * all:                   // add comment blocks to each file
 *                        // modularize procedures to load registered
 *                           alliances, fetch data from google sheets, match 
 *                           role to alliance, search for registered alliances
 *
 * index.js               COMPLETE // add config file support for sensitive information
 *
 * google.js              COMPLETE // add config file support for sensitive information
 *                           
 * memberData.js:         // add argument: alliance - if alliance is passed,
 *                           skip role checking and retrieve data on that
 *                        // case-insensitive searches on members
 *
 *                        COMPLETE // add alias !member and !members
 *                        COMPLETE // add alliance name to top of results
 *
 * registerAlliance.js:   COMPLETE // restrict to admin
 *
 * unregisterAlliance.js: COMPLETE // restrict to admin
 *
 * strikeTeam.js:         COMPLETE // add support for alliance lookup
 *                        COMPLETE // case-insensitive searches on members
 *                        // allign team column to right
 *                        // return path assignment for member query
 *
 * assignStrikeTeams.js:  // auto-reassign roles to match new strike team
 *                           assignments - admin only
 *
 * config file parameters:
 * index.js:
 *      CommandoClient: ownerID (discord user ID, CommandClient constructor, 18-digit numerical string)
 *                      botToken (client.login, 59-character mixed-case string)
 * google.js:
 *      oAuth2Client: ClientID (googleapi credentials, https://console.developers.google.com/apis/)
 *                    Secret Token
 *                    oauth redirect url
 *****************************************************************************/
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const config = require('./config');

const client = new CommandoClient({
    commandPrefix: '!',
    unknownCommandResponse: false,
    owner: config.commando.ownerID,
    disableEveryone: true
});

sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['group1', 'Our First Command Group']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('Bot life.');
});

client.login(config.commando.botToken);
