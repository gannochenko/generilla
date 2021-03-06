import nanoid from 'nanoid';
// import os from 'os';
import path from 'path';
import pathExists from 'path-exists';
// import ncp from 'ncp';
import del from 'del';
import fs from 'fs-extra';
// import { promisify } from 'util';
import { ReferenceParseResult } from './type';
import { GIT } from './git';
import { NPM } from './npm';
import { GeneratorRecord } from './generator-record';
import { GeneratorList } from './generator-list';
import { absolutizePath, describeGenerator } from './util';

export class GeneratorRecordManager {
    constructor(private generatorsPath = '') {}

    public async add(reference: ReferenceParseResult) {
        const id = `gen-${nanoid()}`;
        const recordManager = new GeneratorRecord(this.generatorsPath);

        if (reference.type === 'remote') {
            if (!(await GIT.isAvailable())) {
                throw new Error('Git is not installed');
            }

            const repository = reference.repository!;
            const generatorPath = reference.path;

            const finalRepositoryPath = path.join(this.generatorsPath, id);
            const finalGeneratorPath = path.join(
                finalRepositoryPath,
                reference.path,
            );

            await GIT.clone(repository, this.generatorsPath, id, true);
            if (reference.branch) {
                await GIT.checkout(finalRepositoryPath, reference.branch);
            }

            if (!(await pathExists(finalGeneratorPath))) {
                await this.rmGeneratorById(id);
                throw new Error(
                    `Path "${reference.path}" was not found in the repository`,
                );
            }

            if (await NPM.isAvailable()) {
                await NPM.reInstall(finalGeneratorPath);
            }

            const generatorItem = await GeneratorList.getGeneratorItem(
                this.generatorsPath,
                {
                    id,
                    branch: reference.branch,
                    path: generatorPath,
                    type: reference.type,
                },
            );
            if (!generatorItem) {
                await this.rmGeneratorById(id);
                throw new Error(
                    'Having hard times importing an index file of the generator. Use -d option to see the error.',
                );
            }

            await recordManager.addGenerator(id, {
                id,
                branch: reference.branch,
                path: reference.path,
                type: reference.type,
            });
        } else if (reference.type === 'local') {
            // symlink it
            const finalRepositoryPath = absolutizePath(
                path.join(this.generatorsPath, id),
            );
            await fs.ensureSymlink(reference.path, finalRepositoryPath);
            await recordManager.addGenerator(id, {
                id,
                type: reference.type,
            });
        } else {
            throw new Error('Unknown reference type');
        }
    }

    public async update(query: string) {
        const generators = await GeneratorList.getList(
            this.generatorsPath,
            query,
            'remote',
        );

        // eslint-disable-next-line no-restricted-syntax
        for (const generator of generators) {
            console.log(`➡️  Updating ${describeGenerator(generator)}`);
            const finalRepositoryPath = path.join(
                this.generatorsPath,
                generator.id,
            );
            // eslint-disable-next-line no-await-in-loop
            await GIT.pull(finalRepositoryPath, generator.branch);

            // eslint-disable-next-line no-await-in-loop
            if (await NPM.isAvailable()) {
                // eslint-disable-next-line no-await-in-loop
                await NPM.reInstall(
                    path.join(finalRepositoryPath, generator.path),
                );
            }
        }
    }

    public async remove(query: string) {
        const generators = await GeneratorList.getList(
            this.generatorsPath,
            query,
        );
        const recordManager = new GeneratorRecord(this.generatorsPath);

        if (generators.length) {
            // kill em all
            const ids: string[] = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const generator of generators) {
                console.log(`❌ Removing ${describeGenerator(generator)}`);
                // eslint-disable-next-line no-await-in-loop
                await this.rmGeneratorById(generator.id);
                ids.push(generator.id);
            }

            await recordManager.removeGenerators(ids);
        }
    }

    private async rmGeneratorById(id: string) {
        return del([path.join(this.generatorsPath, id)], {
            force: true,
        });
    }
}
