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
            console.log(source);
        }
    }
}
