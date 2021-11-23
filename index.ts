import DiscordJS, { Intents, TextChannel } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from "mongoose"
import { addToTeam } from './functions/addToTeam';
import QueueSchema from './utils/QueueSchema'
import { selectPlayersForGame } from './functions/selectPlayersForGame';
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
    let static_roles: string[] = ['Registered', 'US-East', 'Europe', 'US-West', 'Asia SE-Mainland', 'Asia SE-Maritime', 'Middle East', 'Asia East', 'Oceania', 'South Africa', 'South America', 'India']
    const guild = client.guilds.fetch("879445475059707965");
    for (var i in static_roles) {
        const role = (await guild).roles.cache.find(role => role.name == static_roles[i]);
        if (!role) {
            (await guild).roles.create({
                name: static_roles[i],
                color: '#000000'
            });
            console.log('Role ' + static_roles[i] + ' has been created');
        }
    }
})

// Register commands that are not in the slash commands
// bot_slash_command is used here to register and store commands on cache
// Better to run here when a new command would be added.
client.on('messageCreate', message => {
    console.log('CREATED ' + message)
});

client.on("messageDelete", async msg => {
    //console.log(msg.id)
    await QueueSchema.find({ messageId: msg.id })
        .then(async (msgID) => {
            await QueueSchema.deleteOne({ messageId: msg.id })
        })
})

// Checking if our command is a slash command.
// If it is we will have the ping and add commands added.
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'accept_team_invite') {
            let invitedPlayer = interaction.message.content.split(' ')[0].replace(/[<@!&>]/g, '')
            let reactUser = interaction.user.id
            if (reactUser === invitedPlayer) {
                let messageChannel: TextChannel = client.channels!.cache.get('905496347153662002') as TextChannel;
                let message = interaction.message.id
                let teamName: string = interaction.message.embeds[0].author!.name!
                let teamPlaylist: string = interaction.message.embeds[0].fields![1].value!
                let teamRole = interaction.guild!.roles.cache.find(role => role.name == '(' + teamPlaylist + ') ' + teamName)
                addToTeam(invitedPlayer, messageChannel, message, teamName, teamRole!)
                let member = interaction.guild!.members.cache.get(reactUser)
                await member!.roles.add(teamRole!).catch((err) => {
                    console.log(err)
                })
            }
            else if (reactUser === "641168583862517791") {
                let messageChannel: TextChannel = client.channels!.cache.get('905496347153662002') as TextChannel;
                let message = interaction.message.id
                let teamName: string = interaction.message.embeds[0].author!.name!
                let teamPlaylist: string = interaction.message.embeds[0].fields![1].value
                let teamRole = interaction.guild!.roles.cache.find(role => role.name == '(' + teamPlaylist + ') ' + teamName)
                addToTeam(invitedPlayer, messageChannel, message, teamName, teamRole!)
                let member = interaction.guild!.members.cache.get(reactUser)
                await member!.roles.add(teamRole!).catch((err) => {
                    console.log(err)
                })
            }
        }
        if (interaction.customId === 'decline_team_invite') {
            let invitedPlayer = interaction.message.content.split(' ')[0].replace(/[<@!&>]/g, '')
            let messageChannel: TextChannel = client.channels!.cache.get('905496347153662002') as TextChannel;
            let message = interaction.message.id
            let teamName: string = interaction.message.embeds[0].author!.name!
            let teamPlaylist: string = interaction.message.embeds[0].fields![1].value
            await messageChannel.messages.fetch(message)
                .then(message => message.edit({
                    content: `<@${invitedPlayer}> has declined the invite to join the ${teamPlaylist} team ${teamName}`,
                    embeds: [],
                    components: []
                }))
        }
        if (interaction.customId === 'accept_match') {
            console.log('Match has been accepted')
            let opponentID = interaction.user.id
            let messageChannel: TextChannel = client.channels!.cache.get('908318890369626133') as TextChannel;
            let message = interaction.message.id
            selectPlayersForGame(messageChannel, message, opponentID, interaction)
                .then(async (results) => {
                    if (results == null) {
                        await interaction.reply({
                            ephemeral: true,
                            content: 'Match has been accepted!'
                        })
                        await messageChannel.messages.fetch(message)
                            .then(message => message.delete())
                    }
                    else {
                        await interaction.reply({
                            ephemeral: true,
                            content: 'Match has been accepted! Choose your teammate(s) <@641168583862517791>',
                            components: [
                                results
                            ]
                        })
                        await messageChannel.messages.fetch(message)
                            .then(message => message.delete())
                    }
                })
        }
    }
    if (interaction.isSelectMenu()) {
        if (interaction.customId === 'select_players') {
            console.log('Selecting Players WOOP WOOP')
        }
    }
});
client.login(process.env.TOKEN)