"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
const https = __importStar(require("https"));
const md5 = require("md5");
const private_1 = require("./private");
const translate = (word) => {
    const query = new URLSearchParams();
    const salt = Math.random().toFixed(8);
    const sign = md5(private_1.appid + word + salt + private_1.appSecret);
    let from = 'zh';
    let to = 'en';
    if (/[a-zA-Z]/.test(word[0])) {
        from = 'en';
        to = 'zh';
    }
    query.set('q', word);
    query.set('from', from);
    query.set('to', to);
    query.set('appid', private_1.appid);
    query.set('salt', salt);
    query.set('sign', sign);
    const options = {
        hostname: 'fanyi-api.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query.toString(),
        method: 'GET'
    };
    const request = https.request(options, (response) => {
        let chuncks = [];
        response.on('data', (chunck) => {
            chuncks.push(chunck);
        });
        response.on('end', () => {
            const string = Buffer.concat(chuncks).toString();
            const object = JSON.parse(string);
            if (object.error_code) {
                console.error(object.error_msg);
                process.exit(2);
            }
            else {
                object.trans_result.map((item) => {
                    console.log(item.dst);
                });
                process.exit(0);
            }
        });
    });
    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};
exports.translate = translate;
