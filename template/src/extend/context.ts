import { think } from "thinkjs";

// const ServiceProxy = new Proxy({}, {
//     get(target: any, prop: string, receiver: any) {
//         if (!target[prop]) {
//             target[prop] = think.service(prop);
//         }
//         return target[prop];
//     }
// });

module.exports = {
    get sv() {
        // return ServiceProxy;
        return think.sv;
    }
};
