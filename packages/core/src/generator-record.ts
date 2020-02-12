import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import { ObjectLiteral, ReferenceParseResult } from './type';

const GENERATORS_FILE = '.generators';

export class GeneratorRecord {
    constructor(private generatorsPath = '') {}

    public async add(localPath: string, reference: ReferenceParseResult) {
        const list = await this.getList();

        list.generators.push({
            path: localPath,
            branch: reference.branch,
            subPath: reference.path,
        });

        await this.saveList(list);
    }

    public async getList() {
        const fileName = this.getGeneratorsFileName();

        try {
            return yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
        } catch (e) {
            return {
                generators: [],
            };
        }
    }

    private async saveList(list: ObjectLiteral) {
        fs.writeFileSync(this.getGeneratorsFileName(), yaml.safeDump(list));
    }

    private getGeneratorsFileName() {
        return path.join(this.generatorsPath, GENERATORS_FILE);
    }
}
