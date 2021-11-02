import DiscordJS from 'discord.js'
import { ICommand } from "wokcommands"

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
} as ICommand