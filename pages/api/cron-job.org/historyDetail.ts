import { PlayerNationStatus } from "../../../util/getGameStatus";
import { CronMethod, CRON_URL } from "./config";

export default async (token: string, identifier: string | number): Promise<PlayerNationStatus[]> => {
    const detailResponse = await fetch(CRON_URL,
        {
            body: JSON.stringify({ identifier }),
            headers: {
                'Content-Type': 'application/json',
                'X-API-Method': CronMethod.HistoryDetail,
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            method: 'POST',
        }
    );

    if (detailResponse.ok) {
        const { body } = await detailResponse.json();
        return JSON.parse(body);
    } else {
        throw new Error(`Cron failed when fetching details for job history id: ${identifier}`);
    }
};
