import { CRON_URL, CronMethod } from './config';

export default async (token: string, jobId: string | number): Promise<JobHistory[]> => {
    const jobHistoryResponse = await fetch(CRON_URL,
        {
            body: JSON.stringify({ jobId }),
            headers: {
                'Content-Type': 'application/json',
                'X-API-Method': CronMethod.JobHistory,
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
        }
    );

    if (jobHistoryResponse.ok) {
        const { history } = await jobHistoryResponse.json();
        return history;
    } else {
        throw new Error(`Cron failed when fetching history for job ${jobId}`);
    }
};

interface JobHistory {
    jobLogId: number;
    jobId: number;
    identifier: string;
    date: number;
    datePlanned: number;
    jitter: number;
    url: string;
    duration: number;
    status: number;
    statusText: string;
    httpStatus: 200 | 500;
    headers: false;
    body: false;
    stats: {
        nameLookup: number;
        connect: number;
        appConnect: number;
        preTransfer: number;
        startTransfer: number;
        total: number;
    }
}
