/**
 * @deprecated
 */

import path from 'path';
import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs';
import execa from 'execa';
import pathExists from 'path-exists';
import caseFormatter from 'case-formatter';
import { GeneratorListItem, Generator, GeneratorImport } from './type';
import { TextConverter } from './text-converter';
import { Template } from './template';
import { Debug } from './debug';

export class GeneratorList {
    public static async getList(folder: string) {
        const list: GeneratorListItem[] = [];

        const textConverter = new TextConverter();

        const folderList = await this.getFolderList(folder);
        // eslint-disable-next-line no-restricted-syntax
        for (const generatorFolder of folderList) {
            let imported: GeneratorImport;
            try {
                // eslint-disable-next-line no-await-in-loop
                imported = await import(generatorFolder);
            } catch (error) {
                Debug.log(error);
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
                pathExists,
                caseFormatter,
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
