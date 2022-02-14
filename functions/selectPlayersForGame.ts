import { Client, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } from "discord.js"
import MatchSchema from "../utils/MatchSchema"
import QueueSchema from "../utils/QueueSchema"
import TeamSchema from "../utils/TeamSchema"

export async function selectPlayersForGame(messageChannel: TextChannel, messageID: string, opponentID: string, client: Client<boolean>) {
    console.log('Please select your players')
    const queueMessage = await messageChannel.messages.fetch(messageID)
    console.log(opponentID)
    let row = null;
    let embed = null;
    async function createDropdownForOpponentTeam() {
        await QueueSchema.find({ messageId: queueMessage.id })
            .then((id) => {
                id.forEach(async element => {
                    if (element.playlist === '1s') {
                        console.log('Return')
                        // Fix this to create the match
                        await TeamSchema.find({ playlist: element.playlist, captainsId: opponentID })
                            .then((id) => {
                                id.forEach(async player => {
                                    await MatchSchema.create({
                                        messageId: queueMessage.id,
                                        playlist: element.playlist,
                                        home_team: element.teamName,
                                        home_player_one_id: element.playerOne,
                                        home_player_two_id: "",
                                        home_player_three_id: "",
                                        away_team: player.teamName,
                                        away_player_one_id: opponentID,
                                        away_player_two_id: "",
                                        away_player_three_id: "",
                                        winning_team: "MATCH_IN_PROGRESS"
                                    })
                                    await QueueSchema.deleteOne({ messageId: queueMessage.id })
                                })
                            })
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
                                id.forEach(async player => {
                                    console.log(player)
                                    if (opponentID === player.captainsId) {
                                        let playerOptionOne = (await client.users.fetch(player.viceCaptainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(player.playerThreeId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        embed = new MessageEmbed()
                                            .setTitle(`Match ${element.messageId} has been accepted! Choose your teammate(s)`)
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
                                                            value: player.viceCaptainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: player.playerThreeId,
                                                        },
                                                    ])
                                            );
                                        await MatchSchema.find({ messageId: element.messageId })
                                            .then(async (result) => {
                                                await MatchSchema.updateOne({ messageId: element.messageId }, { away_team: player.teamName })
                                            })
                                    }
                                    else {
                                        let playerOptionOne = (await client.users.fetch(player.captainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(player.playerThreeId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        embed = new MessageEmbed()
                                            .setTitle(`Match ${element.messageId} has been accepted! Choose your teammate(s)`)
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
                                                            value: player.captainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: player.playerThreeId,
                                                        },
                                                    ])
                                            );
                                        await MatchSchema.find({ messageId: element.messageId })
                                            .then(async (result) => {
                                                await MatchSchema.updateOne({ messageId: element.messageId }, { away_team: player.teamName })
                                            })
                                    }
                                })
                            })
                        //await QueueSchema.deleteOne({ messageId: element.messageId })
                    }
                    else {
                        console.log('OPPONENTS ARE ')
                        console.log(element.playerOne, element.playerTwoId, element.playerThreeId)
                        await TeamSchema.find({
                            "$and": [
                                {
                                    "playlist": element.playlist,
                                    opponentID: { "$in": ["captainsId", "viceCaptainsId"] }
                                }
                            ]
                        })
                            .then((id) => {
                                id.forEach(async player => {
                                    console.log(player)
                                    if (opponentID === player.captainsId) {
                                        let playerOptionOne = (await client.users.fetch(player.viceCaptainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(player.playerThreeId)).username
                                        let playerOptionThree = (await client.users.fetch(player.playerFourId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        embed = new MessageEmbed()
                                            .setTitle(`Match ${element.messageId} has been accepted! Choose your teammate(s)`)
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
                                                            value: player.viceCaptainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: player.playerThreeId,
                                                        },
                                                        {
                                                            label: playerOptionThree,
                                                            description: 'Teammate #3',
                                                            value: player.playerFourId,
                                                        },
                                                    ])
                                            );
                                        await MatchSchema.find({ messageId: element.messageId })
                                            .then(async (result) => {
                                                await MatchSchema.updateOne({ messageId: element.messageId }, { away_team: player.teamName })
                                            })
                                    }
                                    else if (opponentID === player.viceCaptainsId) {
                                        let playerOptionOne = (await client.users.fetch(player.captainsId)).username
                                        let playerOptionTwo = (await client.users.fetch(player.playerThreeId)).username
                                        let playerOptionThree = (await client.users.fetch(player.playerFourId)).username

                                        console.log(playerOptionOne, playerOptionTwo)
                                        embed = new MessageEmbed()
                                            .setTitle(`Match ${element.messageId} has been accepted! Choose your teammate(s)`)
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
                                                            value: player.captainsId,
                                                        },
                                                        {
                                                            label: playerOptionTwo,
                                                            description: 'Teammate #2',
                                                            value: player.playerThreeId,
                                                        },
                                                        {
                                                            label: playerOptionThree,
                                                            description: 'Teammate #3',
                                                            value: player.playerFourId,
                                                        },
                                                    ])
                                            );
                                        await MatchSchema.find({ messageId: element.messageId })
                                            .then(async (result) => {
                                                await MatchSchema.updateOne({ messageId: element.messageId }, { away_team: player.teamName })
                                            })
                                    }
                                })
                            })
                    }
                })
            })
    }
    createDropdownForOpponentTeam()
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(row)
    return [row, embed]
}