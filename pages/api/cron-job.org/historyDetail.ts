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
        const JSONBody = JSON.parse(body);

        if (httpStatus >= 500 && !JSONBody.errorMessage?.includes('Task timed out')) {
            const gameId = url.split('/')[url.split('/').length - 1];
            throw Error(`Something happend with cron-job for ${gameId}`);
        }

        return httpStatus === 200 ? JSONBody : [];
    } catch(error) {
        throw new Error(error);
    }
};
