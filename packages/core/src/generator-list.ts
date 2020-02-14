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
import {
    GeneratorListItem,
    Generator,
    GeneratorImport,
    Nullable,
    ObjectLiteral,
} from './type';
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
            // eslint-disable-next-line no-await-in-loop
            const item = await this.getGeneratorItem(generatorFolder, {
                textConverter,
            });

            if (item) {
                list.push(item);
            }
        }

        return list;
    }

    public static async getGeneratorItem(
        folder: string,
        params: ObjectLiteral = {},
    ): Promise<Nullable<GeneratorListItem>> {
        let imported: GeneratorImport;
        try {
            imported = await import(folder);
        } catch (error) {
            Debug.log(error);
            return null;
        }
        const GeneratorClass = imported.Generator || imported.default;
        if (typeof GeneratorClass !== 'function') {
            return null;
        }

        const generator: Generator = new GeneratorClass({
            inquirer,
            textConverter: params.textConverter || null,
            execa,
            makeTemplate: (templateFolder: string) =>
                new Template(templateFolder),
            ejs,
            pathExists,
            caseFormatter,
            ...params,
        });

        let name = '';
        if (typeof generator.getName === 'function') {
            name = generator.getName();
        }

        return {
            path: folder,
            name: name || path.basename(folder),
            code: path.basename(folder),
            generator,
        };
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
