// @ts-ignore
import find from 'findit';
import { GeneratorListItem, Generator } from './type';
import path from "path";

export class GeneratorList {
    public static async getList(folder: string) {
        const list: GeneratorListItem[] = [];

        const folderList = await this.getFolderList(folder);
        for(let generatorFolder of folderList) {
            const imported = (await import(generatorFolder));
            const generatorClass = imported.Generator || imported.default;
            if (typeof generatorClass !== 'function') {
                return;
            }

            const generator: Generator = new generatorClass();

            let name = '';
            if (typeof generator.getName === 'function') {
                name = generator.getName();
            }

            list.push({
                path: generatorFolder,
                name: name || path.basename(generatorFolder),
                generator,
            });
        }

        return list;
    }

    private static async getFolderList(folder: string) {
        const generators: string[] = [];

        const finder = find(folder);
        finder.on('directory', (dir: string, stat: any, stop: () => void) => {
            if (dir === folder) {
                return;
            }

            generators.push(dir);

            stop();
            return;
        });

        return new Promise<string[]>(resolve => {
            finder.on('end', () => {
                resolve(generators);
            });
        });
    }
}
