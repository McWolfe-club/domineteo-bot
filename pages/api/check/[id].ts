import { NextApiRequest, NextApiResponse } from "next";
import getGameStatus from "../../../util/getGameStatus";
import deleteJob from "../cron-job.org/deleteJob";
import historyDetail from "../cron-job.org/historyDetail";
import jobHistory from "../cron-job.org/jobHistory";
import jobList from "../cron-job.org/jobList";
import login from "../cron-job.org/login";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id: gameId } = req.query;
    
    try {
        const cronToken = await login();
        const { jobs } = await jobList(cronToken);
        const gameJob = jobs.find(j => j.title == gameId);

        try {
            const currentStatus = await getGameStatus(gameId as string);

            // get previous game state and send alert if new turn started
            if (gameJob) {
                const history = await jobHistory(cronToken, gameJob.jobId);
                const identifier = history[0]?.identifier;
                if (identifier) {
                    const previousStatus = await historyDetail(cronToken, identifier);
                    // find nation that was done or unfinished, and is now pending.
                    const newTurn = previousStatus.find(prevNation => {
                        const currentNation = currentStatus.find(n => n.name === prevNation.name);
                        return (prevNation.status === 'Done' || prevNation.status === 'Unfinished') && currentNation.status === 'Pending';
                    }) != null;

                    if (newTurn) {
                        console.log('A new turn appeared');
                        // make bot send message
                        // {
                        //     const discordJson = {
                        //         type: InteractionResType.ChannelMessageWithSource,
                        //         data: {
                        //             tts: false,
                        //             content: `We will now get notifications for game ${gameId}`,
                        //         },
                        //     };
                        // }
                    }
                }
            }

            res.status(200).json(currentStatus);
        } catch (error) {
            if (error === 'Game id not found') {
                const cronToken = await login();
                const { jobs } = await jobList(cronToken);
                const gameJob = jobs.find(j => j.title == gameId);

                await deleteJob(cronToken, gameJob.jobId);
                throw new Error('Game doesn\'t exist anymore. Automatically unsubscribed');
            }

            throw new Error('Something went wrong when trying to get the current state of the game.\n' + error.toString());
        }
    } catch(error) {
        throw new Error(error);
    }
};
