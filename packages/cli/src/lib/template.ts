import ejs from 'ejs';
import fs from 'fs';
// @ts-ignore
import { FsCrawler } from './fs-crawler';
import { ObjectLiteral } from './type';

interface Parameters {
    blowUpLandingSite?: false;
}

export class Template {
    constructor(private path: string) {}

    public async copy(dstPath: string, variables: ObjectLiteral = {}, parameters: Parameters = {}) {
        const crawler = new FsCrawler(this.path);
        const files = await crawler.run(dstPath, variables);

        // copy files one by one
        for (const source in files) {
            const object = files[source];
            if (object.type === 'd') {
                fs.mkdirSync(object.path);
            }
            if (object.type === 'f') {
                const content = await this.renderFile(source, variables) as string;
                fs.writeFileSync(object.path, Buffer.from(content, 'utf-8'));
            }
        }
    }

    private renderFile(file: string, variables: ObjectLiteral) {
        return new Promise((resolve, reject) => {
            ejs.renderFile(file, variables, {}, (err, str) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(str);
                }
            });
        });
    }
}
