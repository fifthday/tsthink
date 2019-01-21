import * as shortid from 'shortid';
import * as crypto from 'crypto';
import * as moment from 'moment';
import ErrorMessage, { ErrorDefineType } from './ErrorMessage';
import { think, Context } from 'thinkjs';
import * as util from 'util';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';

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
    static shortid() {
        return shortid.generate();
    }

    static base64(text: string) {
        let b = Buffer.from(text);
        return b.toString('base64');
    }

    static fromBase64(text: string) {
        const buf = new Buffer(text, 'base64');
        return buf.toString();
    }
    static someMd5() {
        return Utils.md5(Utils.shortid());
    }

    static getMoment(dateString?: string | number | Date) {
        // let dateString = _dateString;
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
    static daysBetween(now: string | number | Date, from: string | number | Date) {
        from = from || 0;
        let dayStart = this.getMoment(now).startOf('day').valueOf();
        let dis = dayStart - this.getMoment(from).startOf('day').valueOf();
        let day = dis / 1000 / 60 / 60 / 24;
        day = Math.floor(day);
        return day;
    }

    static oclock(hour: number, date?: string | number | Date) {
        date = this.toDate(date);
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

    static randSome(num: number, count: number, exclude: number[] = []): number[] {
        // let count = _count;
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

    static splitNumber(total: number, num: number, min?: number, max?: number): number[] {
        if (min != null && max != null && (max < min || total < min * num || total > max * num)) {
            return;
        }
        min = min || 0;
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
                if (!think.isEmpty(tbl[one])) {
                    str += `${one}=${tbl[one]}&`;
                }
            }
            str += key;
            return this.md5(str).toLowerCase();
        }
    }

    static async wait(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    static throw(code: ErrorDefineType | Array<(number | string)>, info?: string): never {
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

    static assertOrThrow(val: any, code: ErrorDefineType | Array<(number | string)>, info?: string) {
        if (typeof val === 'boolean') {
            if (!val) {
                return this.throw(code, info);
            }
        } else {
            if (think.isEmpty(val)) {
                return this.throw(code, info);
            }
        }
        return true;
    }

    static cryptoPassword(password: string) {
        const cryptokey = 'crypto';
        return this.md5(`${password}.+.${cryptokey}`);
    }

    static getRequireParamString(ctx: Context, key: string): string {
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

    static async readFile(file: string, encoding: string = 'utf8') {
        const fsreadfile = util.promisify(fs.readFile);
        const buffer = await fsreadfile(file);
        return buffer.toString(encoding);
    }
    static async readFileBuffer(file: string) {
        const fsreadfile = util.promisify(fs.readFile);
        const buffer = await fsreadfile(file);
        return buffer;
    }

    static async readDir(dir: string, ext?: string): Promise<string[]> {
        const fsreaddir = util.promisify(fs.readdir);
        const fsstat = util.promisify(fs.stat);

        let result: string[] = [];
        let files = await fsreaddir(dir);
        for (let one of files) {
            const fname = `${dir}/${one}`;
            const stats = await fsstat(fname);
            if (stats.isDirectory()) {
                result = result.concat(await this.readDir(fname, ext));
            } else {
                if (fname.endsWith(ext)) {
                    result.push(fname);
                }
            }
        }
        return result;
    }

    static async loadCsv(file: string) {
        const buffer = await this.readFileBuffer(file);
        const csvData: string = iconv.decode(buffer, 'GB2312', {
            stripBOM: true
        });
        const regex = /\r?\n|\"[^\"\r\n]*\"|[^,\r?\n]+|,(?=[,|\n])/g;
        let matchArr = csvData.match(regex);
        if (!think.isArray(matchArr)) {
            return [];
        }

        let arr2: string[][] = [];
        let oneMatch: string[] = [];
        matchArr.forEach(word => {
            if (word === '\r\n' || word === '\n') {
                arr2.push(oneMatch);
                oneMatch = [];
            } else {
                if (word === ',') {
                    word = '';
                }
                oneMatch.push(word.trim());
            }
        });
        return arr2;
    }

    static getClass<T>(ins: T): any {
        let Cls = ins.constructor as any;
        return Cls;
    }
}
