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
  let pending = '';
  let unfinished = '';

  nations.forEach(nat => {
    if (nat.controller == PlayerController.Human && nat.turnplayed !== '2') {
      const nation = `    - ${nat.name}\n`;
      if (nat.turnplayed === '0') {
        pending += nation;
      } else if (nat.turnplayed === '1') {
        unfinished += nation;
      }
    }
  });

  return `${unfinished.length ? 'Unfinished' : ''}:
    ${unfinished.length ? '\`\`\`' : ''}
    ${unfinished}
    ${unfinished.length ? '\`\`\`' : ''}

    ${pending.length ? 'Pending' : ''}:
    ${pending.length ? '\`\`\`' : ''}
    ${pending}
    ${pending.length ? '\`\`\`' : ''}
    `.trim();
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

  const jsonBody = JSON.parse(rawBody);

  if (jsonBody.type === InteractionResType.Pong) {
    res.status(200).json({ type: InteractionResType.Pong });
  } else {
    const optionId = jsonBody.data.options.find(opt => opt.name === 'id');
    const response = await fetch(`https://dom5.snek.earth/api/games/${optionId.value}/status`);

    if (response.ok) {
      const nationData: { nations: Nation[] } = await response.json();
      const discordJson = {
        type: InteractionResType.ChannelMessageWithSource,
        data: {
          tts: false,
          content: buildContentFromNations(nationData.nations)
        }
      };

      res.status(200).json(discordJson);
    } else {
      res.status(200).json({
        type: InteractionResType.ChannelMessageWithSource,
        data: {
          tts: false,
          content: `Cant find game id ${optionId.value}`,
        }
      });
    }
  }
};
