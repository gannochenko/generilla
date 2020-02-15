import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import matcher from 'matcher';
import {
    GeneratorRecordElement,
    GeneratorRecordType,
    ReferenceParseResult,
} from './type';

const GENERATORS_FILE = '.generators';

export class GeneratorRecord {
    constructor(private generatorsPath = '') {}

    public async addGenerator(
        localPath: string,
        reference: ReferenceParseResult,
    ) {
        const list = await this.get();

        list.generators.push({
            id: localPath,
            branch: reference.branch,
            path: reference.path,
        });

        await this.save(list);
    }

    public async removeGenerators(ids: string[]) {
        const record = await this.get();
        return this.save({
            ...record,
            generators: record.generators.filter(generator =>
                ids.includes(generator.id),
            ),
        });
    }

    public async get(query?: string): Promise<GeneratorRecordType> {
        const fileName = this.getGeneratorsFileName();

        try {
            const result = yaml.safeLoad(
                fs.readFileSync(fileName, 'utf8'),
            ) as GeneratorRecordType;

            if (query) {
                return {
                    ...result,
                    generators: this.filterGenerators(result.generators, query),
                };
            } else {
                return result;
            }
        } catch (e) {
            return {
                generators: [],
            };
        }
    }

    private async save(list: GeneratorRecordType) {
        fs.writeFileSync(this.getGeneratorsFileName(), yaml.safeDump(list));
    }

    private getGeneratorsFileName() {
        return path.join(this.generatorsPath, GENERATORS_FILE);
    }

    private filterGenerators(
        generators: GeneratorRecordElement[],
        query: string,
        exclude = false,
    ) {
        return generators.filter(generator => {
            let match = false;
            if (query === '*') {
                match = true;
            } else {
                match = matcher.isMatch(generator.id, query);
            }

            return exclude ? !match : match;
        });
    }
}
