import DiscordJS from 'discord.js'
import { ICommand } from "wokcommands"

export default {
    category: 'Testing',
    description: 'Registers player onto systems',
    slash: 'both',
    testOnly: true,

    options: [
        {
            name: 'username',
            description: 'Enter your Epic Username',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ interaction }) => {
        const { options } = interaction
        const discordID = interaction.user.id
        const username = options.getString('username')!

        await interaction.deferReply({
            ephemeral: true
        })

        // Waiting 5 seconds for the bot to think. Default wait time is 3 seconds (3000)
        await new Promise(resolve => setTimeout(resolve, 5000))

        // We will edit the "bot is thinking" reply with the answer
        await interaction.editReply({
            content: 'Discord ID is ' + discordID + '\nThe player is ' + username
        })

    }
} as ICommand