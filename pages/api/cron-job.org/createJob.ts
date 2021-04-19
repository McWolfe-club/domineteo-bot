import jobList from './jobList';
import { CRON_URL, CronMethod } from './config';
import getGameInfo from '../../../util/getGameInfo';

export default async (token: string, gameId: string, discordChannelId: string) => {
    const { jobs } = await jobList(token);
    const cronTitle = `${gameId}__${discordChannelId}`;

    if (jobs.find(job => job.title.includes(`${gameId}__`)) != null) {
        throw new Error('Game is already being tracked in this channel');
    }

    // check game exists
    await getGameInfo(gameId);

    try {
        const job = { ...defaultJobBody, url: `https://dom.mcwolfe.club/api/check/${gameId}`, title: cronTitle };

        const createJobResponse = await fetch(CRON_URL,
            {
                body: JSON.stringify({ job }),
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
    enabled: true,
    saveResponses: true,
    auth: {
        enable: false,
        user: '',
        password: ''
    },
    notification: {
        onSuccess: false,
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
