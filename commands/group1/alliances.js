/******************************************************************************
 *
 *
 *****************************************************************************/
const { Command } = require('discord.js-commando');
var google = require('../../api/google.js');

module.exports = class AlliancesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'alliances',
            group: 'group1',
            memberName: 'alliances',
            description: 'View all alliances registered on your discord server.',
            examples: ['!alliances'],
            guildOnly: true
        });
    }

    run(msg) {
        // fetch data from db
        var currentAlliances = msg.guild.settings.get("Alliances");

        // scenario - never registered an alliance before will result in currentAlliances == undefined
        if (currentAlliances === undefined) {
            msg.say('There are no alliances registered on this server. Use command \"!register *alliance_name*\" to get started.');
            return;
        }

        // change data to array - this occurs only if one alliance is registered
        if (currentAlliances != undefined && !Array.isArray(currentAlliances)) {
            currentAlliances = [currentAlliances];
        }

        // compile a list of alliance names
        var results = '';
        for (var i = 0, len = currentAlliances.length; i < len; i++) {
            if (len != len - 1) {
                results += ('**<' + currentAlliances[i].alliance + '>**\n');
            }
        }
        if (results.length > 0) {
            msg.say('Registered alliances:');
            msg.say(results);
        } else {
            // this scenario occurs when all previously registered alliances have been unregistered. currentAlliances != undefined
            msg.say('There are no alliances registered on this server. Use command \"!register *alliance_name*\" to get started.');
            return;
        }
    }
};
