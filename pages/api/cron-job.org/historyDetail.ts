import { PlayerNationStatus } from "../../../util/getGameStatus";
import { CronMethod, CRON_URL } from "./config";

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
    
        const { body } = await detailResponse.json();
        return JSON.parse(body);
    } catch(error) {
        throw new Error(`Cron failed when fetching details for job history id: ${identifier}, error: ${JSON.stringify(error)}`);
    }
};
