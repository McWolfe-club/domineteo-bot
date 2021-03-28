import { verifyKey } from "discord-interactions";
import { NextApiRequest } from "next";
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false,
  },
};

// API for dom bot to check status for snek erth game
export default async (req: NextApiRequest, res) => {
  const signature = (req as any).headers["x-signature-ed25519"];
  const timestamp = (req as any).headers["x-signature-timestamp"];

  const rawBody = (await getRawBody(req)).toString();

  console.log(signature, timestamp, rawBody);

  const isValidRequest = verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.APP_PUBLIC_KEY
  );

  console.log({
    req, res,
    signature, timestamp, rawBody,
    token: process.env.APP_PUBLIC_KEY,
    validation: isValidRequest
  });

  if (!isValidRequest) {
    return res.status(401).end("Bad request signature");
  }

  res.status(200).json({
    type: 4,
    data: {
      tts: false,
      content: "Test",
    },
  });
};
