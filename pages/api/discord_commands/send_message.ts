import Discord from 'discord.js';

export default async (message: string, channelId: string): Promise<Discord.Message> => {
    const client = new Discord.Client();
    await client.login(process.env.PUBLIC_KEY);

    try {
        const channel = await client.channels.fetch(channelId) as Discord.TextChannel;
        return channel.send(message);
    } catch {
        throw new Error(`Couldn\'t fetch client channel for bot. Check permissions or that channel exists. ID: ${channelId}`);
    }
};
