import { ICommand } from "wokcommands"
import DiscordJS from 'discord.js'

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
        {
            name: 'region',
            description: 'Set what region you are from.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ interaction }) => {
        const { options } = interaction
        const username = options.getString('username')!
        const region = options.getString('region')!

        await interaction.deferReply({
            ephemeral: true
        })

        //Waiting 5 seconds for the bot to think. Default wait time is 3 seconds (3000)
        await new Promise(resolve => setTimeout(resolve, 5000))

        // We will edit the "bot is thinking" reply with the answer
        await interaction.editReply({
            content: 'The player is ' + username + ' and is from the ' + region + ' region'
        })

    }
} as ICommand