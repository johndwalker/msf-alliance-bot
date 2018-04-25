/******************************************************************************
 *
 *
 *****************************************************************************/
const { Command } = require('discord.js-commando');
var google = require('../../api/google.js');
var table = require('text-table');

module.exports = class StrikeTeamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'striketeam',
            group: 'group1',
            memberName: 'striketeam',
            description: 'Displays strike team assignments.',
            examples: ['!striketeam, !striketeam 1'],
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Enter a player name to get their strike team.',
                    type: 'string',
                    default: 'all'
                }
            ]
        });
    }

    run(msg, { player }) {
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

        var data = google.getStrikeTeamData(alliance.googleSheetID, (data) => {
            var result = 'No results';

            if (player == 'all') {
                msg.say('Strike Team assignments for **<' + alliance.alliance + '>**:');
                result = table(data);
            } else { // search for strike team assignment
                for (var i = 1, column = data[0].length; i < column; i++) {
                    for (var j = 1, row = data.length; j < row; j++) {
                        if (data[j][i].toUpperCase() == player.toUpperCase()) {
                            result = 'Alliance member ' + data[j][i] + ' is currently assigned to Strike Team ' + (i) + '.';
                            break;
                        }
                    }
                }
            }

            return msg.say('```' + result + '```');
        });
    }
};