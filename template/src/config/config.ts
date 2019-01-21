// default config
export const workers = 2;
export const port = 10250;
export const redis = {
    redlock: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
        db: 3
    },
    // rateLimit: {
    //     host: '127.0.0.1',
    //     port: 6379,
    //     password: '',
    //     db: 3
    // }
};
