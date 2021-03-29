import { verifyKey } from "discord-interactions";
import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import getGameStatus, { PlayerNationStatus } from "../../util/getGameStatus";
import { InteractionResType } from "./common";

export const config = {
  api: {
    // needed to avoid conflict with discord-interactions
    bodyParser: false,
  },
};

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

function formatGameStatus(nations: PlayerNationStatus[]) {
  return nations
    .filter((nation) => nation.status != 'Done')
    .map((nation) => `${nation.name} ${nation.status === 'Pending' ? ':alarm_clock:' : ':white_check_mark:'}`)
    .join('\n');
}

// API for dom bot to check status for snek erth game
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = (req as any).headers["x-signature-ed25519"];
  const timestamp = (req as any).headers["x-signature-timestamp"];
  const rawBody = (await getRawBody(req)).toString();
  const isValidRequest = verifyKey(
    rawBody,
    signature,
    timestamp,
    APP_PUBLIC_KEY
  );

  if (!isValidRequest) {
    return res.status(401).end("invalid request signature");
  }

  const jsonBody = JSON.parse(rawBody);

  if (jsonBody.type === InteractionResType.Pong) {
    res.status(200).json({ type: InteractionResType.Pong });
  } else {
    const optionId = jsonBody.data.options.find((opt) => opt.name === "id");

    try {
      const gameStatus = await getGameStatus(optionId);

      const discordJson = {
        type: InteractionResType.ChannelMessageWithSource,
        data: {
          tts: false,
          content: `Game ${optionId}:\n${formatGameStatus}`,
        },
      };

      res.status(200).json(discordJson);
    } catch {
      return res.status(200).json({
        type: InteractionResType.ChannelMessageWithSource,
        data: {
          tts: false,
          content: `Cant find game id ${optionId}`,
        },
      });
    }
  }
};
