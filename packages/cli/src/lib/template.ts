// @ts-ignore
import find from 'findit';
import path from 'path';
import { ObjectLiteral } from './type';

export class Template {
    constructor(private path: string) {}

    async copy(dstPath: string, variables: ObjectLiteral = {}) {
        console.log(dstPath);
        const finder = find(this.path);

        // todo: add timeout here with Promise.race()
        const onEnd = new Promise(resolve => {
            finder.on('end', resolve);
        });

        finder.on('directory', (dir: string, stat: any, stop: () => void) => {
            console.log(dir);
            const base = path.basename(dir);
            if (base === '[component_name]') {
                stop();
                return;
            }
            // var base = path.basename(dir);
            // if (base === '.git' || base === 'node_modules') stop()
            // else console.log(dir + '/')
        });

        // finder.on('file', function (file, stat) {
        //     console.log(file);
        // });
        //
        // finder.on('link', function (link, stat) {
        //     console.log(link);
        // });
    }
}
