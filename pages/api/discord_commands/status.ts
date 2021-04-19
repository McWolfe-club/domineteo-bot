import { NextApiRequest, NextApiResponse } from "next";
import createBotEmbeds from "../../../util/createBotEmbeds";
import formatNationStatus from "../../../util/formatNationStatus";
import getGameInfo from "../../../util/getGameInfo";
import getGameStatus, { PlayerNationStatus } from "../../../util/getGameStatus";
import { InteractionResType } from "../common";

export default async (req: NextApiRequest, res: NextApiResponse, jsonBody: any) => {
    const { value: optionId } = jsonBody.data.options.find((opt) => opt.name === "id");

    try {
        const gameInfo = await getGameInfo(optionId);
        const gameStatus = await getGameStatus(optionId);

        const game = { name: 'Game', value: `[**${gameInfo.name}**](https://dom.mcwolfe.club/game/${optionId})  (*${optionId}*)` };
        const nations = { name: 'Nations', value: gameStatus.map(n => `\`${n.name}\`: \`${formatNationStatus(n.status)}\`\n`).join() };

        const embeds = [createBotEmbeds(`**Game ${gameInfo.name}**`, [game, nations])];

        const discordJson = {
            type: InteractionResType.ChannelMessageWithSource,
            data: {
                embeds,
                tts: false,
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
