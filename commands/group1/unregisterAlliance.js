/******************************************************************************
 *
 *
 *****************************************************************************/
const { Command } = require('discord.js-commando');
var google = require('../../api/google.js');

module.exports = class UnregisterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unregister',
            group: 'group1',
            memberName: 'unregister',
            description: 'Unregister an alliance already registered on your discord server.',
            examples: ['!unregister "My Great Alliance"'],
            guildOnly: true,
            args: [
                {
                    key: 'alliance',
                    prompt: 'What is the name of the alliance you wish to register?',
                    type: 'string'
                },
                {
                    key: 'confirmation',
                    prompt: 'Are you sure you wish to unregister this alliance? This action cannot be undone. You can always re-register at a later time if you change your mind, though. Enter \'yes\' to continue.',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.member.permissions.hasPermission('ADMINISTRATOR', false);
    }

    run(msg, { alliance, confirmation }) {
        // fetch data from db
        var currentAlliances = msg.guild.settings.get("Alliances");

        if (confirmation == 'no' || confirmation == 'No' || confirmation == 'n' || confirmation == 'N') {
            msg.say('Aborting unregistration process. No changes have been made.');
            return;
        }

        // check if there are no current registered alliances
        if (currentAlliances === undefined) {
            msg.say('There are no alliances registered on this server. Use command \"!register *alliance_name*\" to get started.');
            return;
        }

        // change data to array - this occurs only if one alliance is registered
        if (currentAlliances != undefined && !Array.isArray(currentAlliances)) {
            currentAlliances = [currentAlliances];
        }

        // search for alliance in sqlite db - if found, remove
        var exists = false;
        for (var i = 0, len = currentAlliances.length; i < len; i++) {
            if (currentAlliances[i].alliance == alliance) {
                exists = true;
                currentAlliances.splice(i, 1);
                msg.guild.settings.set("Alliances", currentAlliances);
                msg.say('<' + alliance + '> has been unregistered.');
                break; 
            }
        }

        if (!exists) {
            msg.say('Could not find <' + alliance + '> among registered alliances for this server. Did you spell it correctly?');
        }
    }
};
