import { think } from "thinkjs";

const ServiceProxy = new Proxy({}, {
    get(target: any, prop: string, receiver: any) {
        if (!target[prop]) {
            target[prop] = think.service(prop);
        }
        return target[prop];
    }
});

const ConfigProxy = new Proxy({}, {
    get(target: any, prop: string, receiver: any) {
        if (!target[prop]) {
            target[prop] = think.config(prop);
        }
        return target[prop];
    }
});

module.exports = {
    get sv() {
        return ServiceProxy;
    },
    get isDev() {
        return think.env === 'development';
    },
    get isTest() {
        return true;
    },
    get conf() {
        return ConfigProxy;
    }
};
