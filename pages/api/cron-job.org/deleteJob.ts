import { CRON_URL, CronMethod } from './config';

export default async (token: string, jobId: string | number): Promise<Boolean> => {
    try {  
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
        return deleteJobResponse.ok;
    } catch(error) {
        throw new Error(`Couldn\'t delete job of id: ${jobId}, error: ${JSON.stringify(error)}`);
    }
};
