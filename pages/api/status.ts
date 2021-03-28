import { verifyKey } from "discord-interactions";

// API for dom bot to check status for snek erth game
export default (req, res) => {
    const signature = req.headers['X-Signature-Ed25519'];
    const timestamp = req.headers['X-Signature-Timestamp'];
    const isValidRequest = verifyKey(req.rawBody, signature, timestamp, process.env.APP_PUBLIC_KEY);
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
