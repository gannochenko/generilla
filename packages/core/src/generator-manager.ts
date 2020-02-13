import nanoid from 'nanoid';
import os from 'os';
import path from 'path';
import pathExists from 'path-exists';
import ncp from 'ncp';
import del from 'del';
import { promisify } from 'util';
import { ReferenceParseResult } from './type';
import { GIT } from './git';
import { GeneratorRecord } from './generator-record';

export class GeneratorManager {
    constructor(private generatorsPath = '') {}

    public async add(reference: ReferenceParseResult) {
        const id = `gen-${nanoid()}`;
        const tmpDir = os.tmpdir();
        const localPath = path.join(tmpDir, id);
        const localGeneratorPath = path.join(localPath, reference.path);
        const finalRepositoryPath = path.join(this.generatorsPath, id);

        await GIT.clone(reference.repository, tmpDir, id);
        await GIT.checkout(localPath, reference.branch);

        if (!(await pathExists(localGeneratorPath))) {
            throw new Error(
                `Path "${reference.path}" was not found in the repository`,
            );
        }

        const copy = promisify(ncp.ncp);
        await copy(localPath, finalRepositoryPath);

        const recordManager = new GeneratorRecord(this.generatorsPath);
        await recordManager.addGenerator(id, reference);

        // todo: run yarn if package.json is there
    }

    public async remove(query: string) {
        const recordManager = new GeneratorRecord(this.generatorsPath);
        const record = await recordManager.get(query);

        if (record.generators.length) {
            // kill em all
            // eslint-disable-next-line no-restricted-syntax
            for (const generator of record.generators) {
                // eslint-disable-next-line no-await-in-loop
                await del([path.join(this.generatorsPath, generator.id)], {
                    force: true,
                });
            }

            await recordManager.removeGenerators(query);
        }
    }
}
