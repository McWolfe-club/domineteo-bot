import { PlayerNationStatus } from "../../../util/getGameStatus";
import { CronMethod, CRON_URL } from "./config";
import deleteJob from "./deleteJob";

export default async (token: string, identifier: string | number): Promise<PlayerNationStatus[]> => {
    try {
        const detailResponse = await fetch(CRON_URL,
            {
                body: JSON.stringify({ identifier }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Method': CronMethod.HistoryDetail,
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST',
            }
        );
            
        const { body, httpStatus, jobId, url  } = (await detailResponse.json()).jobHistoryDetails;

        if (httpStatus >= 500) {
            await deleteJob(token, jobId);
            const gameId = url.split('/')[url.split('/').length - 1];
            throw Error(`Game Id not found.. unsubscribed from game ${gameId}`);
        }

        return httpStatus === 200 ? JSON.parse(body) : [];
    } catch(error) {
        throw new Error(error);
    }
};
