import * as https from 'https';
import md5 = require('md5')
import { appid, appSecret } from './private';

export const translate = (q: string) => {
  const query = new URLSearchParams();
  const salt = Math.random().toFixed(8);
  const sign = md5(appid + q + salt + appSecret);
  let from = 'zh'
  let to = 'en';
  if (/[a-zA-Z]/.test(q[0])) {
    from = 'en'
    to = 'zh'
  }
  const queries = [q, from, to, appid, salt, sign]
  queries.map((item) => {
    query.set(item, item)
  })

  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query.toString(),
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    let chuncks: Buffer[] = [];
    response.on('data', (chunck: Buffer) => {
      chuncks.push(chunck)
    });
    response.on('end', () => {
      const string = Buffer.concat(chuncks).toString();
      type BaiduResult = {
        error_code?: string;
        error_msg: string;
        from: string;
        to: string;
        trans_result: {
          src: string;
          dst: string;
        }[]
      }
      const object: BaiduResult = JSON.parse(string)
      if (object.error_code) {
        console.error(object.error_msg);
        process.exit(2);
      } else {
        object.trans_result.map((item) => {
          console.log(item.dst);

        })
        process.exit(0);
      }

    })
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
}