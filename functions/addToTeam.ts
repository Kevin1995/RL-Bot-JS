import { TextChannel } from "discord.js";
import TeamSchema from "./../utils/TeamSchema"

export async function addToTeam(invitedPlayer: string, messageChannel: TextChannel, message: string, teamName: string, teamID: string) {
    console.log(invitedPlayer)
    console.log(teamName)
    console.log(teamID)

    await TeamSchema.find({ teamID: teamID })
        .then((id) => {
            id.forEach(async element => {
                if (element.viceCaptainsId === "") {
                    console.log('Vice Captain Empty')
                    await TeamSchema.updateOne({ _id: element._id }, { viceCaptainsId: invitedPlayer })
                    await messageChannel.messages.fetch(message)
                        .then(message => message.edit({
                            content: `<@${invitedPlayer}> has joined ${teamName}`,
                            embeds: [],
                            components: []
                        }))
                }
                else if (element.playerThreeId === "") {
                    console.log('Player Three Empty')
                    await TeamSchema.updateOne({ _id: element._id }, { playerThreeId: invitedPlayer })
                    await messageChannel.messages.fetch(message)
                        .then(message => message.edit({
                            content: `<@${invitedPlayer}> has joined ${teamName}`,
                            embeds: [],
                            components: []
                        }))
                }
                else if (element.playerFourId === "") {
                    console.log('Player Four Empty')
                    await TeamSchema.updateOne({ _id: element._id }, { playerFourId: invitedPlayer })
                    await messageChannel.messages.fetch(message)
                        .then(message => message.edit({
                            content: `<@${invitedPlayer}> has joined ${teamName}`,
                            embeds: [],
                            components: []
                        }))
                }
            })
        })
}