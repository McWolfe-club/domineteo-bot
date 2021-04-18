import { NextApiRequest, NextApiResponse } from "next";
import { InteractionResType } from "./common";
import status from "./discord_commands/status";
import subscribe from "./discord_commands/subscribe";
import validateRequest from './validate-request';

export const config = {
  api: {
    // needed to avoid conflict with discord-interactions
    bodyParser: false,
  },
};

// API for dom bot to check status for snek erth game
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { isValidRequest, jsonBody } = await validateRequest(req, res);

  if (!isValidRequest) {
    return res.status(401).end("invalid request signature");
  }

  if (jsonBody.type === InteractionResType.Pong) {
    res.status(200).json({ type: InteractionResType.Pong });
  } else {
    switch (jsonBody.data.name) {
      case 'status':
        return status(req, res, jsonBody);
      case 'subscribe':
        return subscribe(req, res, jsonBody);
      default:
        throw new Error('Wrong command name');
    }
  }
};
 