// interface ErrorCodeInterface {
//     [index: string]: [number, string];
// }
export default class ErrorMessage {
    static Codes = {
        UserNotFound: [101, '用户不存在'],

        DeprecateError: [7999, '已废弃'],
        RejectError: [8999, '拒绝访问'],
    };

    public code: number;
    public message: string;
    public info: any;
    constructor(code: number, msg: string, info: any) {
        this.code = code;
        this.message = msg || '';
        this.info = info;
    }

    static CustomCode(message: string): [number, string] {
        return [999, message];
    }

}
