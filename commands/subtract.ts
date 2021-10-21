import DiscordJS from 'discord.js'
import { ICommand } from "wokcommands"
export default {
    category: 'Testing',
    description: 'Subtracts two numbers together',
    slash: 'both',
    testOnly: true,
    options: [
        {
            name: 'num1',
            description: 'The first number.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'num2',
            description: 'The second number.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
    ],

    callback: async ({ interaction }) => {

        const { options } = interaction
        const num1 = options.getNumber('num1')!
        const num2 = options.getNumber('num2')!

        // The bot is thinking of the answer
        await interaction.deferReply({
            ephemeral: true
        })

        //Waiting 5 seconds for the bot to think. Default wait time is 3 seconds (3000)
        await new Promise(resolve => setTimeout(resolve, 5000))

        // We will edit the "bot is thinking" reply with the answer
        await interaction.editReply({
            content: 'The sum is ' + (num1 - num2)
        })
    },
} as ICommand