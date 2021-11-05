import DiscordJS, { MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js'
import { ICommand } from "wokcommands"
import TeamSchema from "./../utils/TeamSchema"

export default {
    category: 'Testing',
    description: 'Registers player onto systems',
    slash: 'both',
    testOnly: true,

    options: [
        {
            name: 'playlist',
            description: 'Enter playlist for you want to invite player to',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: "2s",
                    value: "2s"
                },
                {
                    name: "3s",
                    value: "3s"
                },
                {
                    name: "Rumble",
                    value: "Rumble"
                },
                {
                    name: "Dropshot",
                    value: "Dropshot"
                },
                {
                    name: "Hoops",
                    value: "Hoops"
                },
                {
                    name: "Snowday",
                    value: "Snowday"
                },
            ]
        },
        {
            name: 'player',
            description: 'Tag the player you wish to invite',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],

    callback: async ({ client, interaction }) => {
        const { options } = interaction
        const discordID = interaction.user.id
        const playlist = options.getString('playlist')!
        const player = options.getString('player')!
        const invitedPlayer = player.replace(/[<@!&>]/g, '')
        let playerOnOtherTeam: boolean = false;
        let teamFound: boolean = false;
        let maxPlayersOnTeam: boolean = false;
        let teamId: string = ''
        let channel: TextChannel = client.channels!.cache.get('905496347153662002') as TextChannel;
        let invMsg: string = ''
        let invMsgTeamName: string = ''

        await interaction.deferReply({
            ephemeral: true
        })

        await TeamSchema.find({})
            .then((id) => {
                id.forEach(element => {
                    if (teamFound === false) {
                        if (element.captainsId === discordID && element.playlist === playlist) {
                            teamFound = true
                            invMsg = player + ' you have been invited to join the ' + playlist + ' team ' + element.teamName
                            invMsgTeamName = element.teamName
                            teamId = element.teamID
                        }
                    }
                    if (playerOnOtherTeam === false) {
                        if (element.captainsId === invitedPlayer || element.viceCaptainsId === invitedPlayer || element.playerThreeId === invitedPlayer || element.playerFourId === invitedPlayer) {
                            if (element.playlist === playlist) {
                                playerOnOtherTeam = true
                            }
                        }

                    }
                    if ((playlist === '2s' || playlist === 'Hoops') && element.playerThreeId !== "") {
                        playerOnOtherTeam = false
                        teamFound = false
                        maxPlayersOnTeam = true
                        return
                    }

                    if ((playlist !== '2s' && playlist !== 'Hoops' && playlist !== '1s') && element.playerFourId !== "") {
                        playerOnOtherTeam = false
                        teamFound = false
                        maxPlayersOnTeam = true
                        return
                    }
                })
            });

        if (playerOnOtherTeam !== false) {
            interaction.editReply({
                content: player + ' is already on a ' + playlist + ' team.'
            })
            return
        }

        if (teamFound !== false) {
            interaction.editReply({
                content: 'Invite has been sent to ' + player
            })
            console.log(teamId)

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('accept_team_invite')
                        .setLabel('Accept Invite')
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('decline_team_invite')
                        .setLabel('Decline Invite')
                        .setStyle('DANGER')
                )

            const embed = new MessageEmbed()
                .setDescription("Hello World")
                .setTitle('Title')
                .setColor('RED')
                .setAuthor(invMsgTeamName)
                .setFooter('Footer')
                .addFields([
                    {
                        name: 'Team Name',
                        value: `${invMsgTeamName}`,
                        inline: true,
                    },
                    {
                        name: 'Team ID',
                        value: `${teamId}`,
                        inline: true,
                    },
                    {
                        name: 'Format',
                        value: `${playlist}`,
                        inline: true,
                    },
                ])
                .addField('name three', 'value three')
            channel.send({
                content: invMsg,
                embeds: [embed],
                components: [row],
            })
                .then(msg => {
                    setTimeout(() => msg.delete(), 900000)
                })
        } else {
            if (maxPlayersOnTeam !== false) {
                interaction.editReply({
                    content: `Cannot invite ${player} to team ${invMsgTeamName} because it is full`
                })
                return
            }
            interaction.editReply({
                content: 'You have no ' + playlist + ' team. Please create a team for this format!'
            })
            return
        }

    }
} as ICommand