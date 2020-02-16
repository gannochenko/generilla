/**
 * @deprecated
 */

import path from 'path';
import inquirer from 'inquirer';
import ejs from 'ejs';
import execa from 'execa';
import pathExists from 'path-exists';
import caseFormatter from 'case-formatter';
import matcher from 'matcher';
import {
    GeneratorListItem,
    Generator,
    GeneratorImport,
    Nullable,
    ObjectLiteral,
    GeneratorRecordElement,
} from './type';
import { TextConverter } from './text-converter';
import { Template } from './template';
import { Debug } from './debug';
import { absolutizePath } from './util';
import { GeneratorRecord } from './generator-record';

export class GeneratorList {
    public static async getList(folder: string, query?: string, type?: string) {
        const list: GeneratorListItem[] = [];

        const textConverter = new TextConverter();

        const generatorRecordManager = new GeneratorRecord(folder);
        const records = await generatorRecordManager.get();

        // eslint-disable-next-line no-restricted-syntax
        for (const generatorRecord of records.generators) {
            // eslint-disable-next-line no-await-in-loop
            const item = await this.getGeneratorItem(folder, generatorRecord, {
                textConverter,
            });

            if (item) {
                // filter here
                let match = true;

                if (type && item.type !== type) {
                    match = false;
                }

                if (query && !this.isGeneratorMatch(item, query)) {
                    match = false;
                }

                if (match) {
                    list.push(item);
                }
            }
        }

        return list;
    }

    public static async getGeneratorItem(
        folder: string,
        generatorRecord: GeneratorRecordElement,
        params: ObjectLiteral = {},
    ): Promise<Nullable<GeneratorListItem>> {
        const generatorFolder = path.join(
            folder,
            generatorRecord.id,
            generatorRecord.path || '',
        );

        // eslint-disable-next-line no-await-in-loop
        const effectiveGeneratorFolder = absolutizePath(generatorFolder);

        let imported: GeneratorImport;
        try {
            imported = await import(effectiveGeneratorFolder);
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
            id: generatorRecord.id,
            path: folder,
            name: name || path.basename(generatorFolder),
            code: path.basename(generatorFolder),
            branch: generatorRecord.branch || '',
            type: generatorRecord.type,
            generator,
        };
    }

    private static isGeneratorMatch(
        generator: GeneratorListItem,
        query: string,
    ) {
        if (query === '*') {
            return true;
        }

        return matcher.isMatch(
            [generator.id, generator.name, generator.code],
            query,
        );
    }
}
