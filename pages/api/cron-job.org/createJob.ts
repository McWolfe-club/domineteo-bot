import jobList from './jobList';
import { CRON_URL, CronMethod } from './config';

export default async (token: string, gameId: string, discordChannelId: string) => {
    const { jobs } = await jobList(token);
    const cronTitle = `${gameId}__${discordChannelId}`;
    const JSONBody = { ...defaultJobBody, url: `https://dom.mcwolfe.club/api/check/${gameId}`, title: cronTitle };

    if (jobs.find(job => job.title.includes(gameId)) != null) {
        throw new Error('Game is already being tracked in this channel');
    }

    try {
        const createJobResponse = await fetch(CRON_URL,
            {
                body: JSON.stringify(JSONBody),
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Method': CronMethod.CreateJob,
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST',
            }
        );
        return await createJobResponse.json();
    } catch(error) {
        throw new Error(`Cron failed and couldn\'t create new job for game ${gameId}. Error: ${JSON.stringify(error)}`);
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
