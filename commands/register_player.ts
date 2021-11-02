import DiscordJS from 'discord.js'
import { ICommand } from "wokcommands"
import PlayerSchema from "./../utils/PlayerSchema"

export default {
    category: 'Testing',
    description: 'Registers player onto systems',
    slash: 'both',
    testOnly: true,

    options: [
        {
            name: 'region',
            description: 'Choose your region',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: "Europe",
                    value: "Europe"
                },
                {
                    name: "US-East",
                    value: "US-East"
                },
                {
                    name: "US-West",
                    value: "US-West"
                },
                {
                    name: "Asia SE-Mainland",
                    value: "Asia SE-Mainland"
                },
                {
                    name: "Asia SE-Maritime",
                    value: "Asia SE-Maritime"
                },
                {
                    name: "Middle East",
                    value: "Middle East"
                },
                {
                    name: "Asia East",
                    value: "Asia East"
                },
                {
                    name: "Oceania",
                    value: "Oceania"
                },
                {
                    name: "South Africa",
                    value: "South Africa"
                },
                {
                    name: "South America",
                    value: "South America"
                },
                {
                    name: "India",
                    value: "India"
                },
            ]
        },
        {
            name: 'username',
            description: 'Enter your Epic Username',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],

    callback: async ({ interaction }) => {
        const { options } = interaction
        const discordID = interaction.user.id
        const username = options.getString('username')!
        const region = options.getString('region')!
        let playerFound: boolean = false;
        const member = interaction.guild!.members.cache.get(discordID)
        const role = interaction.guild!.roles.cache.find(role => role.name == 'Registered')
        const region_role = interaction.guild!.roles.cache.find(role => role.name == region)

        await interaction.deferReply({
            ephemeral: true
        })

        // Check if data entered is already entered into the DB
        await PlayerSchema.find({})
            .then((id) => {
                id.forEach(element => {
                    if (playerFound === false) {
                        if (element.discordId === discordID) {
                            interaction.editReply({
                                content: 'You are already registered!'
                            })
                            playerFound = true
                        }
                        else if (element.epicUsername === username) {
                            interaction.editReply({
                                content: 'The Epic ID ' + username + ' is already registered with another player'
                            })
                            playerFound = true
                        }
                    }
                });
            })

        // If data is not on DB, push data to DB.
        if (playerFound === false) {
            await PlayerSchema.create({
                discordId: interaction.user.id,
                epicUsername: username,
                mmr: 600
            });

            // Adds the "Registered" role to the new player
            // "!" besides member and role is to do with TS 3.7 and will stop an potential undefined error popping up
            // We will catch the error so the bot dosnt stop running
            await member!.roles.add(role!).catch((err) => {
                console.log(err)
            })

            await member!.roles.add(region_role!).catch((err) => {
                console.log(err)
            })

            // Waiting 5 seconds for the bot to think. Default wait time is 3 seconds(3000)
            await new Promise(resolve => setTimeout(resolve, 5000))

            // We will edit the "bot is thinking" reply with the answer
            await interaction.editReply({
                content: 'You have successfully registered'
            })
        }
    }
} as ICommand