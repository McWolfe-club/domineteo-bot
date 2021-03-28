import { time } from "console";
import { verifyKey } from "discord-interactions";
import { NextApiHandler, NextApiRequest } from "next";

// API for dom bot to check status for snek erth game
export default (req: NextApiRequest, res) => {
    const signature = (req as any).headers['x-signature-ed25519'];
    const timestamp = (req as any).headers['x-signature-timestamp'];
    const isValidRequest = verifyKey(JSON.stringify(req.body), signature, timestamp, process.env.APP_PUBLIC_KEY);
    console.log(signature, timestamp, isValidRequest, process.env.APP_PUBLIC_KEY);
    if (!isValidRequest) {
      return res.status(401).end('Bad request signature');
    }

    res.status(200).json({ 
        type: 4,
        data: {
            tts: false,
            content: 'Test',
        }
     })
}
