import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData, TextChannel } from "discord.js"

export async function selectPlayersForGame(messageChannel: TextChannel, messageID: string) {
    console.log('Please select your players')
    const queueMessage = await messageChannel.messages.fetch(messageID)
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
                ]),
        );
    return row
}