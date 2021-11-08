import DiscordJS from 'discord.js'
import { ICommand } from "wokcommands"
import TeamSchema from "./../utils/TeamSchema"

export default {
    category: 'Testing',
    description: 'Allowing Player to create team',
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

    callback: async ({ interaction }) => {
        const { options } = interaction
        const discordID = interaction.user.id
        const playlist = options.getString('playlist')!
        const player = options.getString('player')!
        const invitedPlayer = player.replace(/[<@!&>]/g, '')

        await interaction.deferReply({
            ephemeral: true
        })

        await TeamSchema.find({ playlist: playlist, captainsId: discordID })
            .then((id) => {
                id.forEach(async element => {
                    if (element.viceCaptainsId === invitedPlayer) {
                        await TeamSchema.updateOne({ _id: element._id }, { captainsId: invitedPlayer, viceCaptainsId: discordID })
                    }
                    else if (element.playerThreeId === invitedPlayer) {
                        await TeamSchema.updateOne({ _id: element._id }, { captainsId: invitedPlayer, playerThreeId: discordID })
                    }
                    else if (element.playerFourId === invitedPlayer) {
                        await TeamSchema.updateOne({ _id: element._id }, { captainsId: invitedPlayer, playerFourId: discordID })
                    }

                })
            })

        await interaction.editReply({
            content: `<@!${discordID}> You have transferred the captin role to ${player}`
        })
    }
} as ICommand