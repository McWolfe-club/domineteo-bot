import { CRON_URL, CronMethod } from './config';

export default async (token: string): Promise<{ jobs: CronJob[], someFailed: boolean }> => {
    try {
        const jobListResponse = await fetch(CRON_URL,
            {
                headers: {
                    'X-API-Method': CronMethod.JobList,
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST',
            }
        );
        return await jobListResponse.json();
    } catch(error) {
        throw new Error(`Cron failed when fetching Job List, error: ${JSON.stringify(error)}`);
    }
};

interface CronJob {
    enabled: boolean;
    jobId: number;
    lastDuration: number;
    lastExecution: number;
    lastStatus: number;
    nextExecution: number;
    requestMethod: 0;
    saveResponses: true;
    schedule: {
        hours: [-1];
        mdays: [-1];
        minutes: [-1];
        months: [-1];
        timezone: "Europe/Madrid";
        wdays: [-1];
    };
    title: string;
    type: 0
    url: string;
}
