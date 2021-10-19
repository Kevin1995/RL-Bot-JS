import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

// Intents - Tells our bot what information it needs to function
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

// When the bot has been executed
client.on('ready', () => {
    console.log('The bot is ready')

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
    if (message.content === '!bot_slash_commands') {
        const guildId = '879445475059707965'
        const guild = client.guilds.cache.get(guildId)
        let commands

        if (guild) {
            commands = guild.commands
        } else {
            commands = client.application?.commands
        }

        // Creates the slash command with a discription on what it does
        commands?.create({
            name: 'ping',
            description: 'Replies with Pong.',
        })

        // The options here are what we need to enter for the slash command
        commands?.create({
            name: 'add',
            description: 'Adds two numbers.',
            options: [
                {
                    name: 'num1',
                    description: 'The first number.',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
                },
                {
                    name: 'num2',
                    description: 'The second number.',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
                },
            ]
        })
        console.log("Slash Commands have been added.")
    }
});

// Checking if our command is a slash command.
// If it is we will have the ping and add commands added.
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options } = interaction

    // Functionality of each slash commands
    if (commandName === 'ping') {
        interaction.reply({
            content: 'pong',
            ephemeral: true,
        })
    } else if (commandName == 'add') {
        const num1 = options.getNumber('num1') || 0
        const num2 = options.getNumber('num2') || 0

        // The bot is thinking of the answer
        await interaction.deferReply({
            ephemeral: true
        })

        //Waiting 5 seconds for the bot to think. Default wait time is 3 seconds (3000)
        await new Promise(resolve => setTimeout(resolve, 5000))

        // We will edit the "bot is thinking" reply with the answer
        await interaction.editReply({
            content: 'The sum is ' + (num1 + num2)
        })
    }
})

client.login(process.env.TOKEN)