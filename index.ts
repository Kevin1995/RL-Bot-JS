import DiscordJS, { Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, TextChannel } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from "mongoose"
import { addToTeam } from './functions/addToTeam';
import QueueSchema from './utils/QueueSchema'
import { selectPlayersForGame } from './functions/selectPlayersForGame';
import MatchSchema from './utils/MatchSchema'
import TeamSchema from './utils/TeamSchema'
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
    /* let queue = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('queue_playlist')
                .setPlaceholder('Nothing selected')
                .setMinValues(0)
                .setMaxValues(1)
                .addOptions([
                    {
                        label: '1s',
                        value: '1s',
                    },
                    {
                        label: '2s',
                        value: '2s',
                    },
                    {
                        label: '3s',
                        value: '3s',
                    },
                    {
                        label: 'Rumble',
                        value: 'Rumble',
                    },
                    {
                        label: 'Hoops',
                        value: 'Hoops',
                    },
                    {
                        label: 'Dropshot',
                        value: 'Dropshot',
                    },
                    {
                        label: 'Snowday',
                        value: 'Snowday',
                    },
                ])
        );
    let messageChannel: TextChannel = client.channels!.cache.get('908318890369626133') as TextChannel;
    await messageChannel.send({
        content: 'Queue here',
        components: [queue]
    }) */
})

// Register commands that are not in the slash commands
// bot_slash_command is used here to register and store commands on cache
// Better to run here when a new command would be added.
client.on('messageCreate', message => {
    console.log('CREATED ' + message)
});

client.on("messageDelete", async msg => {
    //console.log(msg.id)
    /* await QueueSchema.find({ messageId: msg.id })
        .then(async (msgID) => {
            await QueueSchema.deleteOne({ messageId: msg.id })
        }) */
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
            let messageChannel: TextChannel = client.channels!.cache.get('914264483227131945') as TextChannel;
            let message = interaction.message.id
            selectPlayersForGame(messageChannel, message, opponentID, client)
                .then(async (results) => {
                    console.log(results[0])
                    if (results == null) {
                        await messageChannel.messages.fetch(message)
                            .then(message => message.delete())
                        await interaction.reply({
                            ephemeral: true,
                            content: 'Match has been accepted!'
                        })
                    }
                    else {
                        await messageChannel.messages.fetch(message)
                            .then(message => message.delete())
                        await interaction.reply({
                            ephemeral: true,
                            embeds: [
                                results[1]!
                            ],
                            components: [
                                results[0]!
                            ]
                        })
                    }
                })
        }
    }
    if (interaction.isSelectMenu()) {
        if (interaction.customId === 'select_players') {
            let msgID = ''
            const discordID = interaction.user.id
            console.log('Selecting Players WOOP WOOP')
            console.log(interaction.user.id, interaction.values, interaction.message.embeds)
            interaction.message.embeds.some((embed) => {
                msgID = embed.title!.replace(/[^0-9]/g, '');
            })
            console.log(msgID)
            await QueueSchema.find({ messageId: msgID })
                .then((id) => {
                    id.forEach(async player => {
                        console.log(`Home team players are ${player.playerOne}, ${player.playerTwoId}, ${player.playerThreeId}`)
                        console.log(`Away team players are ${interaction.user.id}, ${interaction.values[0]!}, ${interaction.values[1]!}`)
                        await TeamSchema.find({ playlist: player.playlist, discordID: { "$in": ["captainsId", "viceCaptainsId"] } })
                            .then((id) => {
                                id.forEach(async element => {
                                    await MatchSchema.create({
                                        messageId: msgID,
                                        playlist: player.playlist,
                                        home_team: player.teamName,
                                        home_player_one_id: player.playerOne,
                                        home_player_two_id: player.playerTwoId,
                                        home_player_three_id: player.playerThreeId,
                                        away_team: element.teamName,
                                        away_player_one_id: interaction.user.id,
                                        away_player_two_id: interaction.values[0]! ?? "",
                                        away_player_three_id: interaction.values[1]! ?? "",
                                        winning_team: "MATCH_IN_PROGRESS"
                                    })
                                    await QueueSchema.deleteOne({ messageId: msgID })
                                })
                            })
                    })
                })
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({
                content: 'Players for this match have been chosen.'
            })

        }

        if (interaction.customId === 'queue_playlist') {
            const discordID = interaction.user.id
            const playlist = interaction.values[0]
            const queueChannel: TextChannel = client.channels!.cache.get('914264483227131945') as TextChannel;
            let row = null
            let embed = null
            let teamDosntExist = false
            let teamAlreadyInQueue = false
            await interaction.deferReply({ ephemeral: true });
            // Check if team exists
            // Check if team already in queue
            checkIfTeamExists()
            checkIfTeamInQueue()
            function checkIfTeamExists() {
                TeamSchema.find({
                    "$and": [
                        {
                            "playlist": playlist,
                            discordID: { "$in": ["captainsId", "viceCaptainsId"] }
                        }
                    ]
                })
                    .then((id) => {
                        if (id.length !== 1) {
                            console.log('Team not found')
                            teamDosntExist = true
                        }
                    })
            }
            function checkIfTeamInQueue() {
                QueueSchema.find({
                    "$and": [
                        {
                            "playlist": playlist,
                            discordID: { "$in": ["playerOne", "playerTwoId", "playerThreeId"] }
                        }
                    ]
                })
                    .then((id) => {
                        if (id.length !== 0) {
                            teamAlreadyInQueue = true
                        }

                    })
            }

            console.log(teamDosntExist)
            if (teamDosntExist = true) {
                await interaction.editReply({
                    content: `You do not have a ${playlist} team.`,
                })
                return
            }

            if (teamAlreadyInQueue) {
                await interaction.editReply({
                    content: `Your ${playlist} team is already in the queue.`,
                })
                return
            }

            async function createDropdownForQueueing() {
                await TeamSchema.find({
                    "$and": [
                        {
                            "playlist": playlist,
                            discordID: { "$in": ["captainsId", "viceCaptainsId"] }
                        }
                    ]
                })
                    .then((id) => {
                        id.forEach(async element => {
                            console.log(element)
                            if (element.playlist === '1s') {
                                console.log('1s game')
                                await TeamSchema.find({ playlist: element.playlist, captainsId: discordID })
                                    .then((id) => {
                                        id.forEach(async element => {
                                            const accept_button = new MessageActionRow()
                                                .addComponents(
                                                    new MessageButton()
                                                        .setCustomId('accept_match')
                                                        .setLabel('Accept Match')
                                                        .setStyle('SUCCESS')
                                                )

                                            const accept_embed = new MessageEmbed()
                                                .setDescription("Hello World")
                                                .setTitle('Title')
                                                .setColor('RED')
                                                .setAuthor('Queue')
                                                .setFooter('Footer')
                                                .addFields([
                                                    {
                                                        name: 'Playlist',
                                                        value: `${element.playlist}`,
                                                        inline: true,
                                                    },
                                                    {
                                                        name: 'MMR',
                                                        value: `${element.mmr}`,
                                                        inline: true,
                                                    },
                                                ])
                                            let msg = await queueChannel.send({
                                                embeds: [accept_embed],
                                                components: [accept_button],
                                            })
                                            await QueueSchema.create({
                                                messageId: msg.id,
                                                teamName: element.teamName,
                                                playlist: element.playlist,
                                                playerOne: discordID,
                                                playerTwoId: "",
                                                playerThreeId: "",
                                            })
                                        })
                                    })
                            }
                            else if (element.playlist === '2s' || element.playlist === 'Hoops') {
                                QueueSchema.create({
                                    messageId: "",
                                    teamName: element.teamName,
                                    playlist: playlist,
                                    playerOne: discordID,
                                    playerTwoId: "",
                                    playerThreeId: "",
                                })
                                if (discordID === element.captainsId) {
                                    let playerOptionOne = (await client.users.fetch(element.viceCaptainsId)).username
                                    let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username
                                    row = new MessageActionRow()
                                        .addComponents(
                                            new MessageSelectMenu()
                                                .setCustomId('select_players_for_queue')
                                                .setPlaceholder('Nothing selected')
                                                .setMinValues(0)
                                                .setMaxValues(1)
                                                .addOptions([
                                                    {
                                                        label: playerOptionOne,
                                                        description: 'Teammate #1',
                                                        value: element.viceCaptainsId,
                                                    },
                                                    {
                                                        label: playerOptionTwo,
                                                        description: 'Teammate #2',
                                                        value: element.playerThreeId,
                                                    },
                                                ])
                                        );
                                }
                                else {
                                    let playerOptionOne = (await client.users.fetch(element.captainsId)).username
                                    let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username
                                    row = new MessageActionRow()
                                        .addComponents(
                                            new MessageSelectMenu()
                                                .setCustomId('select_players_for_queue')
                                                .setPlaceholder('Nothing selected')
                                                .setMinValues(0)
                                                .setMaxValues(1)
                                                .addOptions([
                                                    {
                                                        label: playerOptionOne,
                                                        description: 'Teammate #1',
                                                        value: element.captainsId,
                                                    },
                                                    {
                                                        label: playerOptionTwo,
                                                        description: 'Teammate #2',
                                                        value: element.playerThreeId,
                                                    },
                                                ])
                                        );
                                }
                            }
                            else {
                                QueueSchema.create({
                                    messageId: "",
                                    teamName: element.teamName,
                                    playlist: playlist,
                                    playerOne: discordID,
                                    playerTwoId: "",
                                    playerThreeId: "",
                                })
                                if (discordID === element.captainsId) {
                                    let playerOptionOne = (await client.users.fetch(element.viceCaptainsId)).username
                                    let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username
                                    let playerOptionThree = (await client.users.fetch(element.playerFourId)).username

                                    row = new MessageActionRow()
                                        .addComponents(
                                            new MessageSelectMenu()
                                                .setCustomId('select_players_for_queue')
                                                .setPlaceholder('Nothing selected')
                                                .setMinValues(0)
                                                .setMaxValues(2)
                                                .addOptions([
                                                    {
                                                        label: playerOptionOne,
                                                        description: 'Teammate #1',
                                                        value: element.viceCaptainsId,
                                                    },
                                                    {
                                                        label: playerOptionTwo,
                                                        description: 'Teammate #2',
                                                        value: element.playerThreeId,
                                                    },
                                                    {
                                                        label: playerOptionThree,
                                                        description: 'Teammate #3',
                                                        value: element.playerFourId,
                                                    },
                                                ])
                                        );
                                }
                                else {
                                    let playerOptionOne = (await client.users.fetch(element.captainsId)).username
                                    let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username
                                    let playerOptionThree = (await client.users.fetch(element.playerFourId)).username

                                    row = new MessageActionRow()
                                        .addComponents(
                                            new MessageSelectMenu()
                                                .setCustomId('select_players_for_queue')
                                                .setPlaceholder('Nothing selected')
                                                .setMinValues(0)
                                                .setMaxValues(2)
                                                .addOptions([
                                                    {
                                                        label: playerOptionOne,
                                                        description: 'Teammate #1',
                                                        value: element.captainsId,
                                                    },
                                                    {
                                                        label: playerOptionTwo,
                                                        description: 'Teammate #2',
                                                        value: element.playerThreeId,
                                                    },
                                                    {
                                                        label: playerOptionThree,
                                                        description: 'Teammate #3',
                                                        value: element.playerFourId,
                                                    },
                                                ])
                                        );
                                }

                            }

                        })
                    })
            }
            createDropdownForQueueing()
            await new Promise(resolve => setTimeout(resolve, 1500))
            if (playlist === "1s") {
                await interaction.editReply({
                    content: 'You have joined the queue.',
                })
                return
            }
            else if (row === null) {
                console.log('ROW IS EMPTY')
                return
            }

            else {
                console.log(row)
                await interaction.editReply({
                    content: 'Select your teammate(s) who will be queing with you',
                    components: [
                        row
                    ],
                })
            }
        }
        if (interaction.customId === "select_players_for_queue") {
            console.log(interaction.user.id, interaction.values)
            const discordID = interaction.user.id
            const queueChannel: TextChannel = client.channels!.cache.get('914264483227131945') as TextChannel;
            await interaction.deferReply({ ephemeral: true });
            await QueueSchema.find({
                discordID: { "$in": ["playerOne", "playerTwoId", "playerThreeId"] }
            })
                .then((id) => {
                    id.forEach(async element => {
                        if (element.playlist === '2s' || element.playlist === 'Hoops') {
                            await TeamSchema.find({ playlist: element.playlist, discordID: { "$in": ["captainsId", "viceCaptainsId", "playerThreeId", "playerFourId"] } })
                                .then((id) => {
                                    id.forEach(async element => {
                                        const accept_button = new MessageActionRow()
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId('accept_match')
                                                    .setLabel('Accept Match')
                                                    .setStyle('SUCCESS')
                                            )

                                        const accept_embed = new MessageEmbed()
                                            .setDescription("Hello World")
                                            .setTitle('Title')
                                            .setColor('RED')
                                            .setAuthor('Queue')
                                            .setFooter('Footer')
                                            .addFields([
                                                {
                                                    name: 'Playlist',
                                                    value: `${element.playlist}`,
                                                    inline: true,
                                                },
                                                {
                                                    name: 'MMR',
                                                    value: `${element.mmr}`,
                                                    inline: true,
                                                },
                                            ])
                                        let msg = await queueChannel.send({
                                            embeds: [accept_embed],
                                            components: [accept_button],
                                        })
                                        await QueueSchema.updateOne({ "playerOne": discordID }, { "messageId": msg.id, "playerTwoId": interaction.values[0]! })
                                        await interaction.editReply({
                                            content: 'You have joined the queue.',
                                        })
                                    })
                                })
                        }
                        else {
                            await TeamSchema.find({ playlist: element.playlist, discordID: { "$in": ["captainsId", "viceCaptainsId", "playerThreeId", "playerFourId"] } })
                                .then((id) => {
                                    id.forEach(async element => {
                                        const accept_button = new MessageActionRow()
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId('accept_match')
                                                    .setLabel('Accept Match')
                                                    .setStyle('SUCCESS')
                                            )

                                        const accept_embed = new MessageEmbed()
                                            .setDescription("Hello World")
                                            .setTitle('Title')
                                            .setColor('RED')
                                            .setAuthor('Queue')
                                            .setFooter('Footer')
                                            .addFields([
                                                {
                                                    name: 'Playlist',
                                                    value: `${element.playlist}`,
                                                    inline: true,
                                                },
                                                {
                                                    name: 'MMR',
                                                    value: `${element.mmr}`,
                                                    inline: true,
                                                },
                                            ])
                                        let msg = await queueChannel.send({
                                            embeds: [accept_embed],
                                            components: [accept_button],
                                        })
                                        await QueueSchema.updateOne({ "playerOne": discordID }, { "messageId": msg.id, "playerTwoId": interaction.values[0]!, "playerThreeId": interaction.values[1]! })
                                        await interaction.editReply({
                                            content: 'You have joined the queue.',
                                        })
                                    })
                                })
                        }
                    })
                })
        }
    }
});
client.login(process.env.TOKEN)