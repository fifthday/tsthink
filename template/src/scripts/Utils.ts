// import * as shortid from 'shortid';
import * as crypto from 'crypto';
import * as moment from 'moment';
import ErrorMessage from './ErrorMessage';
import { think, Context } from 'thinkjs';
import fs = require('fs');

export default class Utils {
    static md5(text: string) {
        return crypto.createHash('md5').update(String(text), 'utf8').digest('hex');
    }
    static async md5File(filePath: string) {
        return new Promise((resolve, reject) => {
            let stream = fs.createReadStream(filePath);
            let hash = crypto.createHash('md5');
            stream.on('data', hash.update.bind(hash));
            stream.on('end', () => {
                resolve(hash.digest('hex'));
            });
        });
    }
    // static shortid() {
    //     return shortid.generate();
    // }

    static base64(text: string) {
        let b = Buffer.from(text);
        return b.toString('base64');
    }
    // static someMd5() {
    //     return Utils.md5(Utils.shortid());
    // }

    static getMoment(_dateString?: string | number | Date) {
        let dateString = _dateString;
        if (typeof dateString === 'string') {
            if (!isNaN(dateString as any)) {
                dateString = Number(dateString);
            }
        }
        if (think.isEmpty(dateString)) {
            return moment();
        }
        return moment(dateString);
    }

    static ms(dateString?: string | number | Date) {
        return this.getMoment(dateString).valueOf();
    }

    static timestamp(dateString?: string | number | Date) {
        // return this.DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        return this.getMoment(dateString).format("YYYY-MM-DD HH:mm:ss");
    }

    static timestampMs(dateString?: string | number | Date) {
        return this.getMoment(dateString).format("YYYY-MM-DD HH:mm:ss.SSS");
    }

    static tsHour(dateString: string | number | Date) {
        return this.getMoment(dateString).format("YYYYMMDDHH");
    }

    // static tsDay(dateString: string | number | Date) {
    //     return this.getMoment(dateString).format("YYYYMMDD");
    // }

    static toDate(dateString?: string | number | Date) {
        return this.getMoment(dateString).format("YYYY-MM-DD");
    }

    static tsRetToClient(dateString: string | number | Date) {
        return this.ms(dateString);
    }

    static dayStartOf(dateString?: string | number | Date) {
        let dayStart = this.getMoment(dateString).startOf('day').valueOf();
        return dayStart;
    }

    static dayEndOf(dateString?: string | number | Date) {
        let dayStart = this.getMoment(dateString).endOf('day').valueOf();
        return dayStart;
    }

    static dayLast(dateString?: string | number | Date) {
        return this.dayStartOf(dateString) + 24 * 60 * 60 * 1000 - this.ms(dateString);
    }

    static getYearWeek(dateString?: string | number | Date) {
        return this.getMoment(dateString).format("GGGG-WW");
    }

    // .zone(-8)
    static daysBetween(now: string | number | Date, _from: string | number | Date) {
        let from = _from || 0;
        let dayStart = this.getMoment(now).startOf('day').valueOf();
        let dis = dayStart - this.getMoment(from).startOf('day').valueOf();
        let day = dis / 1000 / 60 / 60 / 24;
        day = Math.floor(day);
        return day;
    }

    static oclock(hour: number, _date?: string | number | Date) {
        let date = this.toDate(_date);
        return this.getMoment(this.hoursLater(hour, date)).format('YYYY-MM-DD HH');
    }

    static oneHours() {
        return 60 * 60 * 1000;
    }

    static hoursLater(hours: number, from?: string | number | Date) {
        let ts = this.ms(from) + hours * 60 * 60 * 1000;
        // return this.ms(ts);
        return ts;
    }

    static daysLater(days: number, from?: string | number | Date) {
        let ts = this.ms(from) + days * 24 * 60 * 60 * 1000;
        return ts;
    }

    static randLess(num: number): number {
        if (num <= 1) {
            return 0;
        }
        let r = Math.random();
        return Math.floor(r * num);
    }

    static randSome(num: number, _count: number, exclude: number[] = []): number[] {
        let count = _count;
        let arr = [];
        if (num <= count) {
            for (let i = 0; i < count; i++) {
                arr.push(i);
            }
        } else { // if (num > count) {
            for (let i = 0; i < num; i++) {
                if (exclude.indexOf(i) >= 0) {
                    continue;
                }
                let rand1 = Utils.randLess(num - i);
                if (rand1 < count) {
                    arr.push(i);
                    count--;
                }
                if (count <= 0) {
                    break;
                }
            }
        }
        return arr;
    }

    static splitNumber(total: number, num: number, _min?: number, max?: number): number[] {
        if (_min != null && max != null && (max < _min || total < _min * num || total > max * num)) {
            return;
        }
        let min = _min || 0;
        let ret: number[] = [];
        let notFull: number[] = [];
        for (let i = 0; i < num; i++) {
            ret[i] = min;
            notFull.push(i);
        }
        let last = total - min * num;
        while (last > 0) {
            let index = Utils.randLess(notFull.length);
            ret[notFull[index]]++;
            if (max && ret[notFull[index]] >= max) {
                notFull.splice(index, 1);
            }
            last--;
        }
        return ret;
    }
    static splitArray<T>(arr: T[], num: number, min: number, max: number): T[][] {
        let counts = Utils.splitNumber(arr.length, num, min, max);
        if (!counts) {
            return;
        }
        let ret: T[][] = [];
        let from = 0;
        counts.forEach((one, index) => {
            let sub = arr.slice(from, from + one);
            ret.push(sub);
            from += one;
        });
        return ret;
    }

    static oneOf<T>(array: T[]): [T, number] {
        if (!array || array.length === 0) {
            return null;
        }
        let num = Utils.randLess(array.length);
        return [array[num], num];
    }

    static shuffle<T>(array: T[]): void {
        let tmp;
        let current;
        let top = array.length;
        while (--top > 0) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        // return array;
    }

    static takeMd5Sign(tbl: object, key: string) {
        let arr = Object.keys(tbl);
        if (arr.length === 0) {
            return '';
        } else {
            arr.sort();
            let str = '';
            for (let one of arr) {
                if (!think.isTrueEmpty(tbl[one])) {
                    str += `${one}=${tbl[one]}&`;
                }
            }
            str += key;
            return this.md5(str).toLowerCase();
        }
    }

    static async wait(ms: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    static throw(code: [number, string] | Array<number | string>, info: string): never {
        let error = new ErrorMessage(code[0] as number, code[1] as string, info);
        throw error;
        // if (typeof code === 'number') {
        //     let error = new ErrorMessage(code, null, msg);
        //     throw error;
        // } else {
        //     let error = new ErrorMessage(code[0], code[1], msg);
        //     throw error;
        // }
    }

    static cryptoPassword(password: string) {
        const cryptokey = 'crypto';
        return this.md5(`${password}.+.${cryptokey}`);
    }

    static getRequireParamString(ctx: Context, key: string): any {
        let val = ctx.param(key) || ctx.post(key);
        if (!think.isNullOrUndefined(val)) {
            return val;
        } else {
            return '';
        }
    }
    static getRequireParamNumber(ctx: Context, key: string): number {
        let val = ctx.param(key) || ctx.post(key);
        if (!think.isNullOrUndefined(val)) {
            // return Number(val);
            let ret = Number(val);
            if (isNaN(ret)) {
                return 0;
            } else {
                return ret;
            }
        } else {
            return 0;
        }
    }

    static trim(obj: object, excludeKeys?: string[]) {
        for (let k of Object.keys(obj)) {
            if (excludeKeys != null) {
                if (excludeKeys.indexOf(k) >= 0) {
                    delete obj[k];
                }
            }
            if (think.isNullOrUndefined(obj[k])) {
                delete obj[k];
            }
        }
        return obj;
    }

    static trimArray<T>(arr: T[], excludeKeys: T[]) {
        if (think.isEmpty(excludeKeys) || !think.isArray(excludeKeys)) {
            return arr;
        }
        for (let one of excludeKeys) {
            let index = arr.indexOf(one);
            if (index >= 0) {
                arr.splice(index, 1);
            }
        }
        return arr;
    }

    static extOf(str: string, sep: string = '.') {
        let ret = '';
        let lastIndex = str.lastIndexOf(sep);
        if (lastIndex >= 0) {
            ret = str.slice(lastIndex);
        }
        return ret;
    }
}