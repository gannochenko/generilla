// @ts-ignore
import find from 'findit';
import path from 'path';
import fs from 'fs';
import { ObjectLiteral } from './type';

const CONDITION_REGEX = /^\[\?([a-zA-Z_0-9]+)\]/i;

interface TargetFsObject {
    type: 'f' | 'd';
    path: string;
}

type ObjectList = ObjectLiteral<TargetFsObject>;

export class FsCrawler {
    constructor(private path: string) {}

    public async run(dstPath: string, variables: ObjectLiteral = {}) {
        if (!FsCrawler.isObjectExist(this.path)) {
            throw new Error(`No such directory: ${this.path}`);
        }
        if (!FsCrawler.isObjectExist(dstPath)) {
            throw new Error(`No such directory: ${dstPath}`);
        }

        const finder = find(this.path);
        const pathMap: ObjectList = {};

        // todo: add timeout here with Promise.race()
        const onEnd = new Promise<ObjectList>(resolve => {
            finder.on('end', () => {
                resolve(pathMap);
            });
        });

        finder.on('directory', (dir: string, stat: any, stop: () => void) => {
            if (dir === this.path) {
                return;
            }

            const sourcePath = this.evaluatePath(dir, variables);
            if (!sourcePath) {
                stop();
                return;
            }

            pathMap[dir] = {
                type: 'd',
                path: this.makeTargetPath(sourcePath, dstPath),
            };
        });

        finder.on('file', (file: string) => {
            const sourcePath = this.evaluatePath(file, variables);
            if (!sourcePath) {
                return;
            }

            pathMap[file] = {
                type: 'f',
                path: this.makeTargetPath(sourcePath, dstPath),
            };
        });

        // finder.on('link', function (link, stat) {
        //     console.log(link);
        // });

        return onEnd;
    }

    private makeTargetPath(sourcePath: string, dstPath: string) {
        return sourcePath.replace(this.path, dstPath);
    }

    private evaluatePath(pathName: string, variables: ObjectLiteral) {
        let name = path.basename(pathName);
        name = name.trim();
        if (name.startsWith('[?')) {
            const condition = name.match(CONDITION_REGEX);
            if (condition && condition[1]) {
                if (!variables[condition[1]]) {
                    return null;
                }
            }
        }

        for(const variable in variables) {
            const value = variables[variable].toString().replace(/[^a-zA-Z0-9_]/g, '');

            pathName = pathName.replace(new RegExp(`\\[\\?${variable}\\]`, 'i'), '');
            pathName = pathName.replace(new RegExp(`\\[${variable}\\]`, 'g'), value);
        }

        return pathName;
    }

    private static isObjectExist(objectPath: string) {
        try {
            return fs.existsSync(objectPath);
        } catch(err) {
            return false;
        }
    }
}
