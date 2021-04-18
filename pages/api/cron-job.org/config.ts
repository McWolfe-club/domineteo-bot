export const CRON_URL = 'https://api.cron-job.org/';
export const CRON_CREDENTIALS = {
    email: process.env.CRON_LOGIN,
    password: process.env.CRON_PASSWORD
};

export enum CronMethod {
    Login = 'Login',
    JobList = 'GetJobs',
    CreateJob = 'CreateJob',
    JobHistory = 'GetJobHistory',
    HistoryDetail = 'GetJobHistoryDetails',
    Delete = 'DeleteJob',
};
