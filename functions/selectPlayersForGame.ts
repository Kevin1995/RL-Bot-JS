import { ButtonInteraction, MessageActionRow, MessageSelectMenu, TextChannel } from "discord.js"
import QueueSchema from "../utils/QueueSchema"
import TeamSchema from "../utils/TeamSchema"

export async function selectPlayersForGame(messageChannel: TextChannel, messageID: string, opponentID: string, interaction: ButtonInteraction) {
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
                                id.forEach(element => {
                                    console.log(element)
                                    if (opponentID === element.captainsId) {
                                        let playerOptionOne = interaction.guild!.members.cache.get(element.viceCaptainsId)
                                        //let playerOptionTwo = interaction.guild!.members.cache.get(element.playerThreeId)
                                        row = new MessageActionRow()
                                            .addComponents(
                                                new MessageSelectMenu()
                                                    .setCustomId('select_players')
                                                    .setPlaceholder('Nothing selected')
                                                    .setMinValues(1)
                                                    .setMaxValues(2)
                                                    .addOptions([
                                                        {
                                                            label: playerOptionOne!.user.username,
                                                            description: 'Teammate #1',
                                                            value: 'first_option',
                                                        },
                                                        /* {
                                                            label: playerOptionTwo!.user.username,
                                                            description: 'Teammate #2',
                                                            value: 'second_option',
                                                        }, */
                                                    ])
                                            );
                                    }
                                })
                            })
                        await QueueSchema.deleteOne({ messageId: element.messageId })
                    }
                    else {
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('select_players')
                                    .setPlaceholder('Nothing selected')
                                    .setMinValues(1)
                                    .setMaxValues(2)
                                    .addOptions([
                                        {
                                            label: 'Select me',
                                            description: 'This is a description',
                                            value: 'first_option',
                                        },
                                        {
                                            label: 'You can select me too',
                                            description: 'This is also a description',
                                            value: 'second_option',
                                        },
                                        {
                                            label: 'You can select me too',
                                            description: 'This is also a description',
                                            value: 'third_option',
                                        },
                                    ]),
                            );
                        await QueueSchema.deleteOne({ messageId: element.messageId })
                    }
                })
            })
    }
    updateRow()
    await new Promise(resolve => setTimeout(resolve, 1750))
    console.log(row)
    return row
}