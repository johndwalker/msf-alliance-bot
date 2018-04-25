/******************************************************************************
 *
 *
 *****************************************************************************/
const { Command } = require('discord.js-commando');
var google = require('../../api/google.js');
var table = require('text-table');

module.exports = class MemberDataCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memberdata',
            aliases: ['member', 'members'],
            group: 'group1',
            memberName: 'memberdata',
            description: 'Displays a table of information about the members of your alliance.',
            examples: ['!memberdata, !memberdata "SuperDork123"'],
            guildOnly: true,
            args: [
                {
                    key: 'name',
                    prompt: 'Which player would you like information on?',
                    type: 'string',
                    default: 'all'
                }
            ]
        });
    }

    run(msg, { name }) {
        // determine what alliance the user is a member of
        var currentAlliances = msg.guild.settings.get("Alliances");

        // exit case - no registered alliances
        if (currentAlliances === undefined || [currentAlliances].length == 0) {
            msg.say('There are no alliances registered on this server. Use command \"!register *alliance_name*\" to get started.');
            return;
        }

        // change data to array - this occurs only if one alliance is registered
        if (currentAlliances != undefined && !Array.isArray(currentAlliances)) {
            currentAlliances = [currentAlliances];
        }

        var roles = msg.member.roles.array();
        // check for a role that matches a registered alliance
        var match = false;
        var alliance;
        for (var i = 0, len = currentAlliances.length; i < len; i++) {
            for (var j = 0, len2 = roles.length; j < len2; j++) {
                if (currentAlliances[i].alliance == roles[j].name) {
                    match = true;
                    alliance = currentAlliances[i];
                }
            }
        }
        if (!match) {
            msg.say('I was unable to look up your alliance. Make sure you have a role assigned that matches a registered alliance and try again.');
            return;
        }

        // fetch data from google
        var data = google.getMemberData(alliance.googleSheetID, (data) => {
            var result = 'No results';

            // Case 1: return info on all members
            if (name == 'all') {
                result = table(data, { align: ['l','r','r','l'] });
            // Case 2: return info on a specific user
            } else {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i][0] === undefined) { data[i][0] = 'x'; }
                    if (data[i][0].toUpperCase() == name.toUpperCase()) {
                        // make sure nothing is undefined
                        for (var j = 0; j < 4; j++) {
                            if (data[0][j] === undefined) { data[0][j] = 'x'; }
                            if (data[i][j] === undefined) { data[i][j] = 'x'; }
                        }
                        // assign the results and format it pretty
                        result = table([
                            [data[0][0], data[0][1], data[0][2], data[0][3]],
                            [data[i][0], data[i][1], data[i][2], data[i][3]]
                        ], { align: ['l','r','r','l'] });
                        break;
                    }
                }
            }
            msg.say('Member information for **<' + alliance.alliance + '>**');
            return msg.say('```' + result + '```');
        });
    }
};