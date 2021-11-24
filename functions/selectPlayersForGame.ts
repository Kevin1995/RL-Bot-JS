import { ButtonInteraction, Client, MessageActionRow, MessageSelectMenu, TextChannel } from "discord.js"
import QueueSchema from "../utils/QueueSchema"
import TeamSchema from "../utils/TeamSchema"

export async function selectPlayersForGame(messageChannel: TextChannel, messageID: string, opponentID: string, client: Client<boolean>) {
    console.log('Please select your players')
    const queueMessage = await messageChannel.messages.fetch(messageID)
    console.log(opponentID)
    let row = null;
    async function updateRow() {
        await QueueSchema.find({ messageId: queueMessage.id })
            .then((id) => {
                id.forEach(async element => {
                    if (element.playlist === '1s') {
                        console.log('Return')
                        await QueueSchema.deleteOne({ messageId: element.messageId })
                        // Create Match table
                    }
                    else if (element.playlist === '2s' || element.playlist === 'Hoops') {
                        console.log('2S MATCH HAS BEEN FOUND')
                        await TeamSchema.find({

                            "$and": [
                                {
                                    "playlist": element.playlist,
                                    opponentID: { "$in": ["captainsId", "viceCaptainsId"] }
                                }
                            ]
                        })
                            .then((id) => {
                                id.forEach(async element => {
                                    console.log(element)
                                    if (opponentID === element.captainsId) {
                                        let playerOptionOne = (await client.users.fetch(element.viceCaptainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        row = new MessageActionRow()
                                            .addComponents(
                                                new MessageSelectMenu()
                                                    .setCustomId('select_players')
                                                    .setPlaceholder('Nothing selected')
                                                    .setMinValues(1)
                                                    .setMaxValues(2)
                                                    .addOptions([
                                                        {
                                                            label: playerOptionOne,
                                                            description: 'Teammate #1',
                                                            value: element.viceCaptainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: element.playerThreeId,
                                                        },
                                                    ])
                                            );
                                    }
                                    else {
                                        let playerOptionOne = (await client.users.fetch(element.captainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        row = new MessageActionRow()
                                            .addComponents(
                                                new MessageSelectMenu()
                                                    .setCustomId('select_players')
                                                    .setPlaceholder('Nothing selected')
                                                    .setMinValues(1)
                                                    .setMaxValues(2)
                                                    .addOptions([
                                                        {
                                                            label: playerOptionOne,
                                                            description: 'Teammate #1',
                                                            value: element.captainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: element.playerThreeId,
                                                        },
                                                    ])
                                            );
                                    }
                                })
                            })
                        await QueueSchema.deleteOne({ messageId: element.messageId })
                    }
                    else {
                        await TeamSchema.find({

                            "$and": [
                                {
                                    "playlist": element.playlist,
                                    opponentID: { "$in": ["captainsId", "viceCaptainsId"] }
                                }
                            ]
                        })
                            .then((id) => {
                                id.forEach(async element => {
                                    console.log(element)
                                    if (opponentID === element.captainsId) {
                                        let playerOptionOne = (await client.users.fetch(element.viceCaptainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username
                                        let playerOptionThree = (await client.users.fetch(element.playerFourId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        row = new MessageActionRow()
                                            .addComponents(
                                                new MessageSelectMenu()
                                                    .setCustomId('select_players')
                                                    .setPlaceholder('Nothing selected')
                                                    .setMinValues(1)
                                                    .setMaxValues(2)
                                                    .addOptions([
                                                        {
                                                            label: playerOptionOne,
                                                            description: 'Teammate #1',
                                                            value: element.viceCaptainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: element.playerThreeId,
                                                        },
                                                        {
                                                            label: playerOptionThree,
                                                            description: 'Teammate #3',
                                                            value: element.playerFourId,
                                                        },
                                                    ])
                                            );
                                    }
                                    else if (opponentID === element.viceCaptainsId) {
                                        let playerOptionOne = (await client.users.fetch(element.captainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(element.playerThreeId)).username
                                        let playerOptionThree = (await client.users.fetch(element.playerFourId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        row = new MessageActionRow()
                                            .addComponents(
                                                new MessageSelectMenu()
                                                    .setCustomId('select_players')
                                                    .setPlaceholder('Nothing selected')
                                                    .setMinValues(1)
                                                    .setMaxValues(2)
                                                    .addOptions([
                                                        {
                                                            label: playerOptionOne,
                                                            description: 'Teammate #1',
                                                            value: element.captainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: element.playerThreeId,
                                                        },
                                                        {
                                                            label: playerOptionThree,
                                                            description: 'Teammate #3',
                                                            value: element.playerFourId,
                                                        },
                                                    ])
                                            );
                                    }
                                    await QueueSchema.deleteOne({ messageId: element.messageId })
                                })
                            })
                    }
                })
            })
    }
    updateRow()
    await new Promise(resolve => setTimeout(resolve, 1750))
    console.log(row)
    return row
}