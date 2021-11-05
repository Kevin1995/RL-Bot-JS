import DiscordJS, { MessageActionRow, MessageButton, TextChannel } from 'discord.js'
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
        let channel: TextChannel = client.channels!.cache.get('905496347153662002') as TextChannel;
        let invMsg: string = ''

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
                        }
                    }
                    if (playerOnOtherTeam === false) {
                        if (element.captainsId === invitedPlayer || element.viceCaptainsId === invitedPlayer || element.playerThreeId === invitedPlayer || element.playerFourId === invitedPlayer) {
                            if (element.playlist === playlist) {
                                playerOnOtherTeam = true
                            }
                        }

                    }
                })
            });

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept')
                    .setLabel('Accept Invite')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('decline')
                    .setLabel('Decline Invite')
                    .setStyle('DANGER')
            )

        if (playerOnOtherTeam !== false) {
            interaction.editReply({
                content: player + ' is already on a ' + playlist + ' team.'
            })
            return
        }

        if (teamFound !== false) {
            interaction.editReply({
                content: 'Sending invite to ' + player
            })
            channel.send({
                content: invMsg,
                components: [row]
            })
                .then(msg => {
                    setTimeout(() => msg.delete(), 900000)
                })
        } else {
            interaction.editReply({
                content: 'You have no ' + playlist + ' team. Please create a team for this format!'
            })
            return
        }

    }
} as ICommand