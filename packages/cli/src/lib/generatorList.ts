import { GeneratorListItem, Generator, GeneratorImport } from './type';
import path from 'path';
import inquirer from 'inquirer';
import ejs from 'ejs';
import execa from 'execa';
import { TextConverter } from './text-converter';
import { Template } from './template';
import fs from 'fs';

export class GeneratorList {
    public static async getList(folder: string) {
        const list: GeneratorListItem[] = [];

        const textConverter = new TextConverter();

        const folderList = await this.getFolderList(folder);
        for (let generatorFolder of folderList) {
            let imported: GeneratorImport;
            try {
                imported = await import(generatorFolder);
            } catch (error) {
                continue;
            }
            const GeneratorClass = imported.Generator || imported.default;
            if (typeof GeneratorClass !== 'function') {
                continue;
            }

            const generator: Generator = new GeneratorClass({
                inquirer,
                textConverter,
                execa,
                makeTemplate: (templateFolder: string) =>
                    new Template(templateFolder),
                ejs,
            });

            let name = '';
            if (typeof generator.getName === 'function') {
                name = generator.getName();
            }

            list.push({
                path: generatorFolder,
                name: name || path.basename(generatorFolder),
                code: path.basename(generatorFolder),
                generator,
            });
        }

        return list;
    }

    public static async getByCode(folder: string, generatorCode: string) {
        console.log(generatorCode);
        return (await this.getList(folder)).find(
            item => item.name === generatorCode,
        );
    }

    private static async getFolderList(folder: string) {
        return fs
            .readdirSync(folder)
            .map(subFolder => path.join(folder, subFolder));
    }
}
