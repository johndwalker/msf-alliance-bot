/******************************************************************************
 *
 *
 *****************************************************************************/
const { Command } = require('discord.js-commando');
var google = require('../../api/google.js');

module.exports = class RegisterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'register',
            group: 'group1',
            memberName: 'register',
            description: 'Allows for registration of multiple alliances within the same discord server.',
            examples: ['!register "My Great Alliance"'],
            guildOnly: true,
            args: [
                {
                    key: 'alliance',
                    prompt: 'What is the name of the alliance you wish to register?',
                    type: 'string'
                },
                {
                    key: 'googleSheetID',
                    prompt: 'What is the Google sheet ID associated with this alliance? This is a 44 character-length string located in the sheet\'s URL. For example, consider the following URL: https://docs.google.com/spreadsheets/d/2OsZvEYF_SvdU2hA3D4e2uoE2Kr_6I_k9bVaslMihrc8/edit#gid=0. The id is \"2OsZvEYF_SvdU2hA3D4e2uoE2Kr_6I_k9bVaslMihrc8\". Copy-paste it here.',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.member.permissions.hasPermission('ADMINISTRATOR', false);
    }

    run(msg, { alliance, googleSheetID }) {
        // fetch data from db
        var currentAlliances = msg.guild.settings.get("Alliances");

        // change data to array - this occurs only if one alliance is registered
        if (currentAlliances != undefined && !Array.isArray(currentAlliances)) {
            currentAlliances = [currentAlliances];
        }

        // Case 1: no alliances registered
        if (currentAlliances === undefined) {
            msg.guild.settings.set("Alliances", { alliance, googleSheetID });
            msg.say('Registration for alliance <' + alliance + '> complete!');
            msg.say('Please turn on \"Link sharing - Anyone with the link **can view**\" for this sheet if you have not already done so, otherwise I won\'t be able to fetch data from it.');
        } else {
            // Case 2: already registered
            var exists = false;
            for (var i = 0, len = currentAlliances.length; i < len; i++) {
                if (currentAlliances[i].alliance == alliance) {
                    exists = true;
                    msg.say('You have already registered that alliance.');
                    break; 
                }
            }
            // Case 3: registering additional alliance
            if (!exists) {
                currentAlliances.push({ alliance, googleSheetID });
                msg.guild.settings.set("Alliances", currentAlliances);
                msg.say('Registration for alliance <' + alliance + '> complete!');
                msg.say('Please turn on \"Link sharing - Anyone with the link **can view**\" for this sheet if you have not already done so, otherwise I won\'t be able to fetch data from it.');
            }
        }
    }
};
