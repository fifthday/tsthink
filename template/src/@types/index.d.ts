import { think } from "thinkjs";

declare module 'thinkjs' {
    // export var think: Think;
    export interface Logic {
        rules: any;
    }
}
