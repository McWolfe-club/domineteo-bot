import { verifyKey } from "discord-interactions";
import { NextApiRequest } from "next";
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false,
  },
};

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

// API for dom bot to check status for snek erth game
export default async (req: NextApiRequest, res) => {
  const signature = (req as any).headers["x-signature-ed25519"];
  const timestamp = (req as any).headers["x-signature-timestamp"];

  const rawBody = (await getRawBody(req)).toString();

  const isValidRequest = verifyKey(
    rawBody,
    signature,
    timestamp,
    APP_PUBLIC_KEY,
  );

  console.log({
    signature, timestamp, rawBody, APP_PUBLIC_KEY, isValidRequest,
  });
    
  if (!isValidRequest) {
    return res.status(401).end("invalid request signature");
  }

  res.status(200).json({type: 1});
};
