import { CRON_URL, CronMethod } from './config';

export default async (token: string, jobId: string | number): Promise<Boolean> => {
    const deleteJobResponse = await fetch(CRON_URL,
        {
            body: JSON.stringify({ jobId }),
            headers: {
                'Content-Type': 'application/json',
                'X-API-Method': CronMethod.Delete,
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
        }
    );

    if (deleteJobResponse.ok) {
        return true;
    } else {
        throw new Error(`Couldn\'t delete job of id: ${jobId}`);
    }
};
