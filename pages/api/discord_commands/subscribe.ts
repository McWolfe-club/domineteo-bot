import { NextApiRequest, NextApiResponse } from "next";
import { InteractionResType } from "../common";
import createJob from "../cron-job.org/createJob";
import login from "../cron-job.org/login";

export default async (req: NextApiRequest, res: NextApiResponse, jsonBody: any) => {
    const { channel_id } = jsonBody;
    const { value: gameId } = jsonBody.data.options.find((opt) => opt.name === "id");

    try {
        const token = await login();
        await createJob(token, gameId, channel_id);
        const discordJson = {
            type: InteractionResType.ChannelMessageWithSource,
            data: {
                tts: false,
                content: `We will now get notifications for game \`${gameId}\``,
            },
        };
        res.status(200).json(discordJson);
    } catch (error) {
        return res.status(200).json({
            type: InteractionResType.ChannelMessageWithSource,
            data: {
                tts: false,
                content: `${error}`,
            },
        });
    }

};
