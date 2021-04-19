import Discord from 'discord.js';

export default async (message: string, channelId: string): Promise<Discord.Message> => {
    const client = new Discord.Client();
    // await client.login(process.env.DISCORD_LOGIN); // todo: add an env for discord login
    await client.login('ODI1ODAwMDE1MTIwNTY0MjI0.YGDMMg.xLec0KDJSUIu3uF98rUKdBVuYJI');

    try {
        const channel = await client.channels.fetch(channelId) as Discord.TextChannel;
        return channel.send(message);
    } catch {
        throw new Error(`Couldn\'t fetch client channel for bot. Check permissions or that channel exists. ID: ${channelId}`);
    }
};
