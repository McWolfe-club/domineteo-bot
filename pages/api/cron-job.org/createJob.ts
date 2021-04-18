import login from './login';
import jobList from './jobList';
import { CRON_URL, CronMethod } from './config';

export default async (token: string, gameId: string) => {
    const { jobs } = await jobList(token);

    if (jobs.find(job => job.title === gameId) != null) {
        throw new Error('Game is already being tracked');
    }

    const createJobResponse = await fetch(CRON_URL,
        {
            body: JSON.stringify({
                ...defaultJobBody,
                url: `https://dom.mcwolfe.club/api/check/${gameId}`,
                title: gameId,
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-API-Method': CronMethod.CreateJob,
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
        }
    );

    if (createJobResponse.ok) {
        return createJobResponse.json();
    } else {
        throw new Error(`Cron failed and couldn\'t create new job for game ${gameId}`);
    }
};

const defaultJobBody = {
    job: {
        enabled: true,
        saveResponses: true,
        auth: {
            enable: false,
            user: '',
            password: ''
        },
        notification: {
            onSuccess: true,
            onDisable: true,
            onFailure: false
        },
        requestMethod: 0,
        extendedData: {
            body: '',
            headers: {}
        },
        schedule: {
            mdays: [-1],
            wdays: [-1],
            months: [-1],
            hours: [-1],
            minutes: [-1],
            timezone: 'Europe/Madrid'
        }
    }
}
