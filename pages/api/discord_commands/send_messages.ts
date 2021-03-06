import Discord from 'discord.js';
import createBotEmbeds from '../../../util/createBotEmbeds';

export default async (channelId: string, title: string, messages: { name: string, value: string}[]): Promise<Discord.Message> => {
    const client = new Discord.Client();
    await client.login(process.env.BOT_TOKEN);

    try {
        const channel = await client.channels.fetch(channelId) as Discord.TextChannel;
        const embed = createBotEmbeds(title, messages);
        return channel.send(embed);
    } catch {
        throw new Error(`Couldn\'t fetch client channel for bot. Check permissions or that channel exists. ID: ${channelId}`);
    }
};
