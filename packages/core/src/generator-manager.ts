import nanoid from 'nanoid';
import os from 'os';
import path from 'path';
import pathExists from 'path-exists';
import ncp from 'ncp';
import { promisify } from 'util';
import { ReferenceParseResult } from './type';
import { GIT } from './git';
import { GeneratorRecord } from './generator-record';

export class GeneratorManager {
    constructor(private generatorsPath = '') {}

    public async add(reference: ReferenceParseResult) {
        const as = `gen-${nanoid()}`;
        const tmpDir = os.tmpdir();
        const localPath = path.join(tmpDir, as);
        const localGeneratorPath = path.join(localPath, reference.path);
        const finalRepositoryPath = path.join(this.generatorsPath, as);

        await GIT.clone(reference.repository, tmpDir, as);
        await GIT.checkout(localPath, reference.branch);

        if (!(await pathExists(localGeneratorPath))) {
            throw new Error(
                `Path "${reference.path}" was not found in the repository`,
            );
        }

        const copy = promisify(ncp.ncp);
        await copy(localPath, finalRepositoryPath);

        const recordManager = new GeneratorRecord(this.generatorsPath);
        await recordManager.add(as, reference);

        // todo: run yarn if package.json is there
    }
}
