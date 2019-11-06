// @ts-ignore
import find from 'findit';
import path from 'path';
import fs from 'fs';
import { ObjectLiteral, ObjectList } from './type';
import { Interpolator } from './interpolator';

const CONDITION_REGEX = /^\[\?([a-zA-Z_0-9]+)\]/i;

export class FsCrawler {
    constructor(private targetPath: string) {}

    public async run(dstPath: string, variables: ObjectLiteral = {}) {
        if (!FsCrawler.isObjectExist(this.targetPath)) {
            throw new Error(`No such directory: ${this.targetPath}`);
        }
        if (!FsCrawler.isObjectExist(dstPath)) {
            throw new Error(`No such directory: ${dstPath}`);
        }

        const finder = find(this.targetPath);
        const pathMap: ObjectList = {};

        // todo: add timeout here with Promise.race()
        const onEnd = new Promise<ObjectList>(resolve => {
            finder.on('end', () => {
                resolve(pathMap);
            });
        });

        finder.on('directory', (dir: string, stat: any, stop: () => void) => {
            if (dir === this.targetPath) {
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
        return sourcePath.replace(this.targetPath, dstPath);
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

        return Interpolator.apply(pathName, variables);
    }

    private static isObjectExist(objectPath: string) {
        try {
            return fs.existsSync(objectPath);
        } catch (err) {
            return false;
        }
    }
}
