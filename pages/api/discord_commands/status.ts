import { NextApiRequest, NextApiResponse } from "next";
import getGameInfo from "../../../util/getGameInfo";
import getGameStatus, { PlayerNationStatus } from "../../../util/getGameStatus";
import { InteractionResType } from "../common";

function formatGameStatus(nations: PlayerNationStatus[]) {
    return nations
        .filter((nation) => nation.status != 'Done')
        .map((nation) => `${nation.name} ${nation.status === 'Pending' ? ':alarm_clock:' : ':white_check_mark:'}`)
        .join('\n');
}

export default async (req: NextApiRequest, res: NextApiResponse, jsonBody: any) => {
    const { value: optionId } = jsonBody.data.options.find((opt) => opt.name === "id");

    try {
        const gameInfo = await getGameInfo(optionId);
        const gameStatus = await getGameStatus(optionId);

        const discordJson = {
            type: InteractionResType.ChannelMessageWithSource,
            data: {
                tts: false,
                content: `Game [**${gameInfo.name}**](https://dom.mcwolfe.club/game/${optionId}) (*${optionId}*):\n${formatGameStatus(gameStatus)}`,
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
