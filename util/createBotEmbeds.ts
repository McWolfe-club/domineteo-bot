import Discord from 'discord.js';

export default function (title: string, messages: { name: string, value: string}[]): Discord.MessageEmbed {
    return new Discord.MessageEmbed()
        .setTitle(title)
        .setColor('#a85232')
        .addFields(messages);
}
