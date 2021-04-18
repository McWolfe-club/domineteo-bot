import { NextApiRequest, NextApiResponse } from "next";
import { verifyKey } from "discord-interactions";
import getRawBody from "raw-body";

const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

export default async (req: NextApiRequest, res: NextApiResponse): Promise<{ isValidRequest: boolean; jsonBody: any }> => {
    const signature = (req as any).headers["x-signature-ed25519"];
    const timestamp = (req as any).headers["x-signature-timestamp"];
    const rawBody = (await getRawBody(req)).toString();
    return { isValidRequest: verifyKey(
      rawBody,
      signature,
      timestamp,
      APP_PUBLIC_KEY
    ), jsonBody: JSON.parse(rawBody) };
}
