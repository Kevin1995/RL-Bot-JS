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
            description: 'Enter playlist for your team.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: "1s",
                    value: "1s"
                },
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

        await TeamSchema.find({ playlist: playlist, captainsId: discordID })
            .then((id) => {
                id.forEach(async element => {
                    const role = interaction.guild!.roles.cache.find(role => role.name == '(' + playlist + ') ' + element.teamName)
                    const created_channel = interaction.guild!.channels.cache.find(channel => channel.name == playlist + '-' + element.teamName.toLowerCase())
                    await TeamSchema.deleteOne({ playlist: playlist, captainsId: discordID })
                    role!.delete();
                    created_channel!.delete()
                })
            })
    }
} as ICommand