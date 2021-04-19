import { NextApiRequest, NextApiResponse } from "next";
import getGameInfo from "../../../util/getGameInfo";
import getGameStatus from "../../../util/getGameStatus";
import historyDetail from "../cron-job.org/historyDetail";
import jobHistory from "../cron-job.org/jobHistory";
import jobList from "../cron-job.org/jobList";
import login from "../cron-job.org/login";
import send_messages from "../discord_commands/send_messages";
import formatNationStatus from '../../../util/formatNationStatus';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id: gameId } = req.query;
    try {
        const cronToken = await login();
        const { jobs } = await jobList(cronToken);
        const gameJob = jobs.find(j => j.title.includes(gameId as string));
        const channelId = gameJob?.title.split('__')[1];

        const currentStatus = await getGameStatus(gameId as string);

        // get previous game state and send alert if new turn started
        if (gameJob) {
            const history = await jobHistory(cronToken, gameJob.jobId);
            const identifier = history[0]?.identifier;
            if (identifier) {
                const previousStatus = await historyDetail(cronToken, identifier);
                // find nation that was done or unfinished, and is now pending.

                if (Array.isArray(currentStatus) && !currentStatus[0]?.status) {
                    res.status(200).json(previousStatus);
                    return;
                }

                const newTurn = previousStatus.find(prevNation => {
                    const currentNation = currentStatus.find(n => n.name === prevNation.name);
                    return (prevNation.status === 'Done' || prevNation.status === 'Unfinished') && currentNation?.status === 'Pending';
                }) != null;

                if (newTurn) {
                    const gameInfo = await getGameInfo(gameId as string);
                    const game = { name: 'Game', value: `[**${gameInfo.name}**](https://dom.mcwolfe.club/game/${gameId})  (*${gameId}*)` };
                    const nations = { name: 'Nations', value: currentStatus.map(n => `\`${n.name}\`: \`${formatNationStatus(n.status)}\`\n`).join('') };
                    const title = `There's a new turn for ${gameInfo.name}`;

                    send_messages(channelId, title, [game, nations]);
                }
            }
        }

        res.status(200).json(currentStatus);
    } catch (error) {
        throw new Error('Something went wrong when trying to get the current state of the game.\n' + error.toString());
    }
};
