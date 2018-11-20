import { think } from "thinkjs";
import Lock = require('redlock');

type Map = {
    [key: string]: any;
}
declare module 'thinkjs' {
    // export var think: Think;
    export interface Logic {
        rules: any;
    }

    export interface Context {
        state: {
            rateLimit: object;
            lockers: Lock.Lock[];
        }
    }

    export interface ThinkConfig {
        config(): Map;
    }
}
