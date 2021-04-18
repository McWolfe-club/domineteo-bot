import { PlayerNationStatus } from "../../../util/getGameStatus";
import { CronMethod, CRON_URL } from "./config";
import deleteJob from "./deleteJob";

export default async (token: string, identifier: string | number): Promise<PlayerNationStatus[]> => {
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

    if (detailResponse.ok) {
        const { body, httpStatus, jobId } = await detailResponse.json();

        if (httpStatus === 500) {
            await deleteJob(token, jobId);
            throw new Error(`Deleted job (${jobId}) since game data no longer exists`);
        } else {
            return JSON.parse(body);
        }
    } else {
        throw new Error(`Cron failed when fetching details for job history id: ${identifier}`);
    }
};
