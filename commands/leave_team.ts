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
    ],

    callback: async ({ interaction }) => {
        const { options } = interaction
        const discordID = interaction.user.id
        const playlist = options.getString('playlist')!

        await interaction.deferReply({
            ephemeral: true
        })

        await TeamSchema.find({ playlist: playlist })
            .then((id) => {
                id.forEach(async element => {
                    const role = interaction.guild!.roles.cache.find(role => role.name == '(' + playlist + ') ' + element.teamName)
                    const member = interaction.guild!.members.cache.get(discordID)
                    if (element.viceCaptainsId === discordID) {
                        await TeamSchema.updateOne({ _id: element._id }, { viceCaptainsId: "" })
                        await member!.roles.remove(role!)
                    }
                    else if (element.playerThreeId === discordID) {
                        await TeamSchema.updateOne({ _id: element._id }, { playerThreeId: "" })
                        await member!.roles.remove(role!)
                    }
                    else if (element.playerFourId === discordID) {
                        await TeamSchema.updateOne({ _id: element._id }, { playerFourId: "" })
                        await member!.roles.remove(role!)
                    }

                })
            })

        await interaction.editReply({
            content: `Player <@!${discordID}> has left your ${playlist} team `
        })
    }
} as ICommand