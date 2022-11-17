const { EmbedBuilder } = require('discord.js');
const Extension = require('../../core/command');
const Command = require('../../core/command.js');
const Bot = require('../../core/bot.js');
const Gamedig = require('gamedig');

class GSInfo extends Extension {
    constructor(bot) {
        super(bot);
        this._bot = bot;
        this._name = 'GSInfo';
        this._description = 'Provides information about game servers';
        this._version = '1.0.0';
        this._author = 'Shigbeard';
    }

    setupCommands() {
        let gsinfo = new Command(this._bot, {
            name: 'gsinfo',
            description: 'Provides information about game servers',
            version: '1.0.0',
            author: 'Shigbeard',
            guildOnly: false,
            usage: {
                command: 'gsinfo',
                options: [
                    {
                        name: 'ip',
                        description: 'The IP address of the server',
                        type: 'STRING',
                        required: true
                    },
                    {
                        name: 'port',
                        description: 'The port of the server. Defaults to "27015"',
                        type: 'NUMBER',
                        required: false,
                        default: 27015
                    },
                    {
                        name: 'type',
                        description: 'The type of server you are querying. Defaults to "tf2"',
                        type: 'STRING',
                        required: false,
                        default: 'tf2'
                    }
                ]
            },
            permissions: [],
            cooldown: 0
        });
        gsinfo.command
            .setName(gsinfo.name)
            .setDescription(gsinfo.description)
            .addStringOption(option =>
                option
                    .setName('ip')
                    .setDescription('The IP address of the server')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option
                    .setName('port')
                    .setDescription('The port of the server. Defaults to "27015"')
                    .setRequired(false)
            )
            .addStringOption(option =>
                option
                    .setName('type')
                    .setDescription('The type of server you are querying. Defaults to "tf2"')
                    .setRequired(false)
            );
        gsinfo.execute = this.execute;
        this._bot.registerCommand(gsinfo);
    }

    async execute(interaction) {
        let ip = interaction.options.getString('ip');
        let port = interaction.options.getInteger('port');
        let type = interaction.options.getString('type');
        if (!port) {
            port = 27015;
        }
        if (!type) {
            type = 'tf2';
        }
        let server =  await Gamedig.query({
            type: type,
            host: ip,
            port: port
        });
        if (server.name) {
            server.query = {
                address: ip,
                port: port
            }
            let embed = new EmbedBuilder();
            embed.setTitle(server.name);
            embed.setDescription(server.map);
            var players = []
            if (server.players) {
                server.players.forEach(player => {
                    players.push(player.name);
                });
            }
            var playerstring = "No Players online"
            if (players.length > 0) {
                playerstring = players.join(", ");
            }
            embed.addFields(
                { name: 'Players', value: `${server.players.length}/${server.maxplayers}`, inline: true },
                { name: 'Ping', value: `${server.ping}ms`, inline: true },
                { name: 'Address', value: `${server.query.address}:${server.query.port}`, inline: true },
                { name: 'PlayerList', value: playerstring, inline: false }
                // { name: 'Players', value: players.join(', '), inline: false }
                // { name: 'PlayerList', value: server.players.map(player => player.name).join(', ') }
            );
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('No server found');
        }
    }
    setup() {
        try {
            this.setupCommands();
            return true
        } catch (error) {
            this._bot.log(error);
            return false;
        }
    }
}

module.exports = function(bot) {
    var gsinfo = new GSInfo(bot);
    return gsinfo.setup();
}