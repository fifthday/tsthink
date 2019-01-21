import Lock = require('redlock');
// import LoaderService from '../service/loader';

import * as Config from '../config/config';
declare module 'thinkjs' {
    interface ISvType {
        // loader: LoaderService;
    }

    export interface Think {
        sv: ISvType;
        isDev: boolean;
        isTest: boolean;
        conf: typeof Config;
    }

    export interface Context {
        state: {
            rateLimit: object;
            lockers: Lock.Lock[];
            user: {
                user_id: number;
                token: string;
            };
        };
        sv: ISvType;
    }

    export interface Controller {
        sv: ISvType;
        uid: number;
    }

    export interface Service {
        sv: ISvType;
    }
}
