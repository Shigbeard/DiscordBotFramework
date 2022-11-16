const { Client, GatewayIntentBits } = require('discord.js');
const Bot = require('./core/bot.js');
require('dotenv').config();
var intents = InterpretIntents();
var bot = new Bot(new Client({ intents: intents }));

// capture ctrl+c event and exit normally
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    bot.client.destroy();
    process.exit();
});

function InterpretIntents() {
    var intentsArr = process.env.INTENTS.split(' ');
    var intents = 0;
    for (var i = 0; i < intentsArr.length; i++) {
        let intstr = intentsArr[i];
        switch (intstr) {
            case 'GUILDS':
                intents += GatewayIntentBits.Guilds;
                break;
            case 'GUILD_MEMBERS':
                intents += GatewayIntentBits.GuildMembers;
                break;
            case 'GUILD_BANS':
                intents += GatewayIntentBits.GuildBans;
                break;
            case 'GUILD_EMOJIS_AND_STICKERS':
                intents += GatewayIntentBits.GuildEmojisAndStickers;
                break;
            case 'GUILD_INTEGRATIONS':
                intents += GatewayIntentBits.GuildIntegrations;
                break;
            case 'GUILD_WEBHOOKS':
                intents += GatewayIntentBits.GuildWebhooks;
                break;
            case 'GUILD_INVITES':
                intents += GatewayIntentBits.GuildInvites;
                break;
            case 'GUILD_VOICE_STATES':
                intents += GatewayIntentBits.GuildVoiceStates;
                break;
            case 'GUILD_PRESENCES':
                intents += GatewayIntentBits.GuildPresences;
                break;
            case 'GUILD_MESSAGES':
                intents += GatewayIntentBits.GuildMessages;
                break;
            case 'GUILD_MESSAGE_REACTIONS':
                intents += GatewayIntentBits.GuildMessageReactions;
                break;
            case 'GUILD_MESSAGE_TYPING':
                intents += GatewayIntentBits.GuildMessageTyping;
                break;
            case 'DIRECT_MESSAGES':
                intents += GatewayIntentBits.DirectMessages;
                break;
            case 'DIRECT_MESSAGE_REACTIONS':
                intents += GatewayIntentBits.DirectMessageReactions;
                break;
            case 'DIRECT_MESSAGE_TYPING':
                intents += GatewayIntentBits.DirectMessageTyping;
                break;
            case 'MESSAGE_CONTENT':
                intents += GatewayIntentBits.MessageContent;
                break;
            case 'GUILD_SCHEDULED_EVENTS':
                intents += GatewayIntentBits.GuildScheduledEvents;
                break;
            case 'AUTO_MODERATION_CONFIGURATION':
                intents += GatewayIntentBits.AutoModerationConfiguration;
                break;
            case 'AUTO_MODERATION_EXECUTION':
                intents += GatewayIntentBits.AutoModerationExecution;
                break;
            case 'ALL':
                if (intentsArr.length == 1) {
                    for (let ii in GatewayIntentBits) {
                        if (typeof GatewayIntentBits[ii] == 'number') { intents += GatewayIntentBits[ii]; }
                    }
                } else {
                    throw new Error('ALL cannot be used with other intents');
                }
                break;
            default:
                console.log('Invalid intent: ' + intstr);
                break;
        }
    }
    return intents;
}

bot.client.login(process.env.TOKEN);