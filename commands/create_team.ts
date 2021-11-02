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
            name: 'team_name',
            description: 'Enter your team name',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],

    callback: async ({ interaction }) => {
        const { options } = interaction
        const discordID = interaction.user.id
        const playlist = options.getString('playlist')!
        const region = options.getString('region')!
        const team_name = options.getString('team_name')!
        let playerFound: boolean = false;
        let teamFound: boolean = false;

        await interaction.deferReply({
            ephemeral: true
        })

        await TeamSchema.find({})
            .then((id) => {
                id.forEach(element => {
                    if (playerFound === false) {
                        if (element.captainsId === discordID || element.viceCaptainsId === discordID || element.playerThreeId === discordID || element.playerFourId === discordID) {
                            if (element.playlist === playlist) {
                                interaction.editReply({
                                    content: 'You are already on a ' + playlist + ' team'
                                })
                                playerFound = true
                                teamFound = true
                            }
                        }
                    }
                    if (teamFound === false) {
                        if (element.teamName === team_name) {
                            interaction.editReply({
                                content: 'Team name ' + team_name + ' already exists!'
                            })
                            playerFound = true
                            teamFound = true
                        }
                    }
                });
            })
        if (teamFound === false) {
            console.log("Teamname dosnt exist")
        }

        if (playerFound === false) {
            // We will edit the "bot is thinking" reply with the answer
            await interaction.editReply({
                content: 'Entering details into database'
            })
            await TeamSchema.create({
                teamID: 1,
                teamName: team_name,
                playlist: playlist,
                region: region,
                mmr: 600,
                rank: "Gold",
                captainsId: discordID,
                viceCaptainsId: "",
                playerThreeId: "",
                playerFourId: "",
            });

            await new Promise(resolve => setTimeout(resolve, 5000))

            // We will edit the "bot is thinking" reply with the answer
            await interaction.editReply({
                content: 'You have successfully created your team'
            })
        }
    }
} as ICommand