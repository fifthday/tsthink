import { think } from "thinkjs";

module.exports = {
    get sv() {
        // return ServiceProxy;
        return think.sv;
    }
};
