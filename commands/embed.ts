import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Testing',
    description: 'Sends and embed',

    permissions: ['ADMINISTRATOR'],
    slash: 'both',
    testOnly: true,

    callback: async ({ message, text }) => {
        const embed = new MessageEmbed()
            .setDescription("Hello World")
            .setTitle('Title')
            .setColor('RED')
            .setAuthor('Kevin')
            .setFooter('Footer')
            .addFields([
                {
                    name: 'name',
                    value: 'value',
                    inline: true,
                },
                {
                    name: 'name two',
                    value: 'value two',
                    inline: true,
                },
                {
                    name: 'name four',
                    value: 'value four',
                    inline: true,
                },
            ])
            .addField('name three', 'value three')

        const newMessage = await message.reply({
            embeds: [embed]
        })

        await new Promise(resolve => setTimeout(resolve, 5000))

        const newEmbed = newMessage.embeds[0]
        newEmbed.setTitle('Edited Title')

        newMessage.edit({
            embeds: [newEmbed]
        })
    },
} as ICommand