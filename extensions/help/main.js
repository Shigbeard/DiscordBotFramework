const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const Extension = require('../../core/command');
const Command = require('../../core/command.js');
const Bot = require('../../core/bot.js');
/**
 * Help Extension
 * @class Help
 * @extends {Extension}
 */
class Help extends Extension {
    /**
     * @param {Bot} bot - The bot object
     */
    constructor(bot){
        if (!bot) {
            throw new Error('Bot object is required');
        }
        super(bot);
        this._bot = bot;
        this._name = 'Help';
        this._description = 'Provides help for commands';
        this._version = '1.0.0';
        this._author = 'Shigbeard';
    }

    setupCommands() {
        let help = new Command({
            name: 'help',
            description: 'Provides help for commands',
            version: '1.0.0',
            author: 'Shigbeard',
            guildOnly: false,
            permissions: [],
            cooldown: 0
        });
        help.command
            .setName(help.name)
            .setDescription(help.description);
        help.execute = this.help;
        this._bot.registerCommand(help);

    }

    
    async help(interaction) {
        var out = '';
        for (let c in this._bot.commands) {
            out += `/${c.name}: ${c.description}\n`;
        }
        await interaction.reply({ content: out, ephemeral: true });
    }

    setup(bot) {
        if (!bot) {
            throw new Error('For some fucking reason, the bot object doesnt exist... how the fuck did we get here then?!?!?!??!?!?!?');
        }
        try {
            this.setupCommands();
            return true
        } catch (error) {
            bot.error(error);
            return false
        }
    }
}

/**
 * All extensions must export a function that takes a single argument
 * The bot object contains all the functions and properties of the bot
 * including the Discord.js client object, all imported extensions, and
 * more.
 * 
 * This exported function is responsible for registering all event listeners
 * and commands for the extension. The bot object exposes some helper functions
 * to make this easier.
 * 
 * @param {object} bot - The bot object
 * @returns {boolean} - Whether the extension loaded successfully. If it did not, the extension will be unloaded.
 */

module.exports = function(bot) {
    var help = new Help(bot);
    return help.setup(bot);
}