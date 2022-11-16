const { REST, Routes, Client, Events, Collection } = require('discord.js');
const Command = require('./command.js');
const BotEvents = require('./events.js');
// import { readdirSync } from 'fs';
const { readdirSync } = require('fs');
/**
 * Default class for a bot.
 * 
 * @class Bot
 * @param {Client} client - The Discord.js client object
 * 
 * @property {Client} client - The Discord.js client object
 * @property {Collection} commands - A collection of all commands
 * @property {Collection} extensions - A collection of all extensions
 * @property {Collection} events - A collection of all events
 * 
 * @method debug - Log a debug message
 * @method log - Log a message to the console
 * @method error - Log an error to the console
 * 
 * @method registerCommand - Register a slash command
 */
class Bot {
    /**
     * @param {Client} client 
     */
    constructor(client) {
        this._client = client;
        this._extensions = new Collection();
        this._commands = new Collection();
        this._events = new BotEvents();
        this._schedules = new Collection();
        // Last think should be time now in milliseconds
        this._last_think = Date.now();

        this._client.once(Events.ClientReady, () => {
            this.log('Client ready, registering extensions');
            this._loadExtensions();

            this._client.on(Events.InteractionCreate, async interaction => {
                if (!interaction.isChatInputCommand()) return;

                const command = this._commands.get(interaction.commandName);

                if (!command) {
                    this.error(`No command mathcing ${interaction.commandName} found.`);
                    interaction.reply({ content: 'That command does not exist!', ephemeral: true });
                    return;
                }
                
                try {
                    let cooldown = command.cooldowns.get(interaction.user.id)
                    if (cooldown) {
                        if (cooldown > Date.now()) {
                            await command.execute(interaction, this);
                            if (command.cooldown > 0) {
                                command.cooldowns.set(interaction.user.id, Date.now() + command.cooldown);
                            }
                        } else {
                            await interaction.reply({ content: `Please wait ${Math.round((cooldown - Date.now()) / 1000)} seconds before using this command again.`, ephemeral: true });
                        }
                    } else {
                        await command.execute(interaction, this);
                        if (command.cooldown > 0) {
                            command.cooldowns.set(interaction.user.id, Date.now() + command.cooldown);
                        }
                    }
                } catch (error) {
                    this.error(`Error while executing command ${interaction.commandName} \n ${error}`);
                    await interaction.reply({ content: `There was an error while executing this command! \n\`\`\`${error}\`\`\``, ephemeral: true });
                }
            });

            for (let e in Events) {
                this._client.on(e, async (...args) => {
                    ev = this._events.get(e)
                    if (ev) {
                        for (let E of ev) {
                            await E.execute(...args);
                        }
                    }
                });
            }
            // sleep for 3 seconds
            setTimeout(() => {
                // register commands
                this.updateCommands();
                for (guild in this._client.guilds.cache) {
                    this.updateCommands(guild);
                }
            }, 3000);
            // process.nextTick(this.think);
        }); 
    }

    // think() {
    //     // calculate delta time
    //     var now = Date.now();
    //     var delta = Date.now() - this._last_think;
    //     if (this._schedules.size > 0) {
    //         // loop through all schedules, execute if needed
    //         for (let s of this._schedules) {
    //             if (s.nextrun <= now) {
    //                 nextrun = s.execute(delta, s.lastrun);
    //                 if (nextrun) {
    //                     s.nextrun = nextrun;
    //                 } else {
    //                     s.unregister();
    //                     this._schedules.delete(s.name);
    //                 }
    //                 s.lastrun = now;
    //             }
    //         }
    //     }   
    //     this._last_think = Date.now();
    //     process.nextTick(this.think);
    // }

    get client() {
        return this._client;
    }

    get commands() {
        return this._commands;
    }

    get extensions() {
        return this._extensions;
    }
    
    get events() {
        return this._events;
    }



    debug(message) {
        console.debug(message);
    }

    log(message) {
        console.log(message);
    }

    error(message) {
        console.error(message);
    }

    _loadExtensions() {
        this.log('Loading extensions...');
        var exts = readdirSync('./extensions', { withFileTypes: true });
        for (var i = 0; i < exts.length; i++) {
            if (exts[i].isDirectory()) {
                // try loading extension.json
                var ext = require(`../extensions/${exts[i].name}/extension.json`);
                if (ext) {
                    let valid = this._isValidExtensionJSON(ext);
                    if (valid) {
                        // try loading main.js
                        try {
                            var main = require(`../extensions/${exts[i].name}/${ext.entrypoint}`);
                            if (main) {
                                var extension = main(this);
                                if (extension) {
                                    this._extensions.set(extension.name, extension);
                                    this.log(`Loaded extension ${ext.name}`);
                                } else {
                                    this.error(`Failed to load extension ${ext.name}`);
                                }
                            } else {
                                this.error(`Failed to import extension ${ext.name}`);
                            }
                        } catch (e) {
                            this.error(`Encountered error while trying to load ${ext.name}`);
                            this.error(e.stack);
                        }
                    } else {
                        this.error(`Invalid extension.json in /extensions/${exts[i].name}`);
                    }
                } else {
                    this.error(`Failed to import extension.json in /extensions/${exts[i].name}`);
                }
            }
        }
    }

    registerCommand(command) {
        if (command instanceof Command) {
            this._commands.set(command.name, command);
            this.log(`Registered command ${command.name}`);
        } else {
            this.error('Invalid command');
        }
    }

    updateCommands(guild=null) {
        let commands = [];
        for (let [_,v] of this._commands) {
            if (v.guildOnly == false && guild == null) {
                commands.push(v.command.toJSON());
            } else if (v.guildOnly == true && guild != null) {
                commands.push(v.command.toJSON());
            }
        }
        let rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (guild == null) {
                    this.log(`Started refreshing ${commands.length} global application (/) commands.`);
                    await rest.put(
                        Routes.applicationCommands(process.env.CLIENT_ID),
                        { body: commands },
                    );
                } else {
                    this.log(`Started refreshing ${commands.length} guild application (/) commands for ${guild.name}.`);
                    await rest.put(
                        Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
                        { body: commands },
                    );
                }

            } catch (error) {
                this.error(error);
            }
        })();
    }
    
    _isValidExtensionJSON(json) {
        if (json.name && json.description && json.version && json.author && json.entrypoint) {
            return true;
        }
        return false;
    }
}

module.exports = Bot;