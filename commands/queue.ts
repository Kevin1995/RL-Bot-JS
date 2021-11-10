import DiscordJS from 'discord.js'
import { ICommand } from "wokcommands"
import TeamSchema from "./../utils/TeamSchema"
import { addToQueue } from "./../functions/addToQueue";

export default {
    category: 'Testing',
    description: 'Allowing Player to create team',
    slash: 'both',
    testOnly: true,

    options: [
        {
            name: 'playlist',
            description: 'Enter playlist you wish to transfer ownership of.',
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
            name: 'playertwo',
            description: 'Tag the 2nd player that will be playing with you.',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
        {
            name: 'playerthree',
            description: 'Tag the 3rd player that will be playing with you.',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],

    callback: async ({ interaction }) => {
        const { options } = interaction
        const discordID = interaction.user.id
        const playlist = options.getString('playlist')!
        let playerTwo = options.getString('playertwo')!
        let playerThree = options.getString('playerthree')!

        if (playlist === '1s' && playerTwo == null && playerThree == null) {
            //console.log(`${playlist} game is all sorted`)
            //console.log(discordID)
            await TeamSchema.find({ "playlist": playlist, "captainsId": discordID })
                .then((id) => {
                    id.forEach(element => {
                        addToQueue(playlist, discordID, '', '')
                    })
                })
        }
        else if ((playlist === '2s' || playlist === 'Hoops') && playerTwo !== null && playerThree == null) {
            //console.log(`${playlist} game is all sorted`)
            playerTwo = playerTwo.replace(/[<@!&>]/g, '')
            await TeamSchema.find({

                "$and": [
                    {
                        "playlist ": playlist
                    },
                    {
                        discordID: { "$in": ["captainsId", "viceCaptainsId"] }
                    }
                ]
            })
                .then((id) => {
                    id.forEach(element => {
                        if (element.captainsId === playerTwo || element.viceCaptainsId === playerTwo || element.playerThreeId === playerTwo || element.playerFourId === playerTwo) {
                            addToQueue(playlist, discordID, playerTwo, '')
                        }
                    })
                })
        }
        else if ((playlist !== '1s' && playlist !== '2s' && playlist !== 'Hoops') && playerTwo !== null && playerThree !== null) {
            //console.log(`${playlist} game is all sorted`)
            playerTwo = playerTwo.replace(/[<@!&>]/g, '')
            playerThree = playerThree.replace(/[<@!&>]/g, '')
            console.log(discordID, playerTwo, playerThree)
            await TeamSchema.find({

                "$and": [
                    {
                        "playlist ": playlist
                    },
                    {
                        discordID: { "$in": ["captainsId", "viceCaptainsId"] }
                    }
                ]
            })
                .then((id) => {
                    id.forEach(element => {
                        if (element.captainsId === playerTwo || element.viceCaptainsId === playerTwo || element.playerThreeId === playerTwo || element.playerFourId === playerTwo) {
                            if (element.captainsId === playerThree || element.viceCaptainsId === playerThree || element.playerThreeId === playerThree || element.playerFourId === playerThree) {
                                addToQueue(playlist, discordID, playerTwo, playerThree)
                            }

                        }
                    })
                })
        } else {
            console.log(`You have not used the command correctly for a ${playlist} game.`)
            return
        }
    }
} as ICommand