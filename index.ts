import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from "mongoose"
dotenv.config()

// Intents - Tells our bot what information it needs to function
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

// When the bot has been executed
client.on('ready', async () => {
    console.log("Discord bot is ready")
    await mongoose.connect(process.env.MONGO_URI || '', {
        keepAlive: true
    })
    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: "879445475059707965"
    })
})

// Register commands that are not in the slash commands
// bot_slash_command is used here to register and store commands on cache
// Better to run here when a new command would be added.
client.on('messageCreate', message => {

});

// Checking if our command is a slash command.
// If it is we will have the ping and add commands added.
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }
});

client.login(process.env.TOKEN)