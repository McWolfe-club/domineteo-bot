import { verifyKey } from 'discord-interactions';
import { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from 'raw-body';
import { InteractionResType, Nation, PlayerController } from './common';

export const config = {
  api: {
    // needed to avoid conflict with discord-interactions
    bodyParser: false,
  },
};

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

function buildContentFromNations(nations: Nation[]): string {
  let message = '';
  nations.forEach(nat => {
    if (nat.controller === PlayerController.Human && nat.turnplayed !== '2') {
      message += `${nat.name}: ${nat.turnplayed === '0' ? 'Pending' : 'Unfinished'}\n`
    }
  });
  return message;
}

// API for dom bot to check status for snek erth game
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = (req as any).headers['x-signature-ed25519'];
  const timestamp = (req as any).headers['x-signature-timestamp'];
  const rawBody = (await getRawBody(req)).toString();
  const isValidRequest = verifyKey(
    rawBody,
    signature,
    timestamp,
    APP_PUBLIC_KEY,
  );

  if (!isValidRequest) {
    return res.status(401).end('invalid request signature');
  }

  if (req.body.type === InteractionResType.Pong) {
    res.status(200).json({ type: InteractionResType.Pong });
  } else {
    const { id } = req.body;
    const response = await fetch(`https://dom5.snek.earth/api/games/${id}/status`);
    if (response.ok) {
      const nationData: { nations: Nation[] } = await response.json();
      const discordJson = {
        type: InteractionResType.ChannelMessageWithSource,
        data: {
          tts: false,
          content: buildContentFromNations(nationData.nations)
        }
      };
    }
  }
};
