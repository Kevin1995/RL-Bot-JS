import { TextChannel } from "discord.js";

export function addToTeam(invitedPlayer: string, messageChannel: TextChannel, message: string) {
    console.log('Message Deleted')
    messageChannel.messages.fetch(message).then(message => message.delete())
}