const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
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
        let help = new Command(this._bot, {
            name: 'help',
            description: 'Provides help for commands',
            version: '1.0.0',
            author: 'Shigbeard',
            guildOnly: false,
            usage: {
                command: 'help',
                options: [
                    {
                        name: 'command',
                        description: 'The command to get help for',
                        type: 'STRING',
                        required: false
                    }
                ]
            },
            permissions: [],
            cooldown: 0
        });
        help.command
            .setName(help.name)
            .setDescription(help.description)
            .addStringOption(option => 
                option
                    .setName('command')
                    .setDescription('The command to get help for')
            );
        help.execute = this.help;
        this._bot.registerCommand(help);

    }

    
    async help(interaction) {
        let command = interaction.options.getString('command');
        if (command) {
            let cmd = this._bot.commands.get(command);
            if (cmd) {
                let usage = ""
                if (cmd.usage) {
                    usage += `/${cmd.usage.command}`;
                    if (cmd.usage.options) {
                        cmd.usage.options.forEach(option => {
                            usage += ` ${option.required ? '<' : '['}${option.name} (${option.type})${option.default ? !null : `=${option.default}`}${option.required ? '>' : ']'}`;
                        })
                    }
                }
                let embed = new EmbedBuilder()
                    .setTitle(cmd.name)
                    .setDescription(cmd.description)
                    .addFields(
                        { name: 'Version', value: cmd.version, inline: true },
                        { name: 'Author', value: cmd.author, inline: true },
                        { name: 'Usage', value: usage, inline: false }
                    )
                interaction.reply({embeds: [embed], ephemeral: true});
            } else {
                interaction.reply({content: 'Command not found', ephemeral: true});
            }
        }
        if (!command) {
            var l = this._bot.commands.size;        
            var out = `Help (${l})\n`;
            this._bot.commands.forEach(cmd => {
                out += `/${cmd.name } - ${cmd.description}\n`;
            });
            await interaction.reply({ content: out, ephemeral: true });
        }
    }

    setup() {
        if (!this._bot) {
            throw new Error('For some fucking reason, the bot object doesnt exist... how the fuck did we get here then?!?!?!??!?!?!?');
        }
        try {
            this.setupCommands();
            return true
        } catch (error) {
            this._bot.error(error);
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
    return help.setup();
}