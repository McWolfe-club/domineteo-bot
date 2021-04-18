import { CRON_URL, CronMethod } from './config';

export default async (token: string): Promise<{ jobs: CronJob[], someFailed: boolean }> => {
    const jobListResponse = await fetch(CRON_URL,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Method': CronMethod.JobList,
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
        }
    );

    if (jobListResponse.ok) {
        return jobListResponse.json();
    } else {
        throw new Error('Cron failed when fetching Job List');
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
