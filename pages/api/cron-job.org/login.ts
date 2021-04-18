import { CRON_URL, CRON_CREDENTIALS, CronMethod } from './config';

export default async (): Promise<string> => {
    try {
        const tokenRes = await fetch(CRON_URL,
            {
                body: JSON.stringify(CRON_CREDENTIALS),
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Method': CronMethod.Login,
                },
                method: 'POST',
            }
        );
        const { token } = await tokenRes.json();
        return token;
    } catch(error) {
        throw new Error(`Couldn\'t login to cron-job.org, error: ${JSON.stringify(error)}`);
    }
};
