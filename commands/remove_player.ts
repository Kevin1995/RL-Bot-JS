import DiscordJS from 'discord.js'
import { ICommand } from "wokcommands"
import TeamSchema from "./../utils/TeamSchema"

export default {
    category: 'Testing',
    description: 'Allowing captain to remove a player from the team.',
    slash: 'both',
    testOnly: true,

    options: [
        {
            name: 'playlist',
            description: 'Enter playlist you need to remove player from',
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
            description: 'Tag the player you wish to remove.',
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
                    const role = interaction.guild!.roles.cache.find(role => role.name == '(' + playlist + ') ' + element.teamName)
                    const member = interaction.guild!.members.cache.get(invitedPlayer)
                    if (element.viceCaptainsId === invitedPlayer) {
                        await TeamSchema.updateOne({ _id: element._id }, { viceCaptainsId: "" })
                        await member!.roles.remove(role!)
                    }
                    else if (element.playerThreeId === invitedPlayer) {
                        await TeamSchema.updateOne({ _id: element._id }, { playerThreeId: "" })
                        await member!.roles.remove(role!)
                    }
                    else if (element.playerFourId === invitedPlayer) {
                        await TeamSchema.updateOne({ _id: element._id }, { playerFourId: "" })
                        await member!.roles.remove(role!)
                    }

                })
            })

        await interaction.editReply({
            content: 'You have removed ' + player + ' from your ' + playlist + ' team'
        })
    }
} as ICommand