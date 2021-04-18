import { NextApiRequest, NextApiResponse } from "next";
import { InteractionResType } from "../common";
import createJob from "../cron-job.org/createJob";
import login from "../cron-job.org/login";
import send_message from "./send_message";

export default async (req: NextApiRequest, res: NextApiResponse, jsonBody: any) => {
    const { channel_id } = jsonBody;
    const { value: gameId } = jsonBody.data.options.find((opt) => opt.name === "id");

    try {
        const token = await login();
        await send_message('I could login', '825796743471693885');
        await createJob(token, gameId, channel_id);
        const discordJson = {
            type: InteractionResType.ChannelMessageWithSource,
            data: {
                tts: false,
                content: `We will now get notifications for game ${gameId}`,
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
