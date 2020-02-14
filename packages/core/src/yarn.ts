import execa from 'execa';
import path from 'path';
import pathExists from 'path-exists';
import { isAvailable } from './util';

export class Yarn {
    protected static isYarnAvailable: boolean;

    public static async install(packagePath: string) {
        if (!(await this.isAvailable())) {
            throw new Error('Not available');
        }

        if (!(await pathExists(path.join(packagePath, 'package.json')))) {
            return;
        }

        await execa('yarn', ['install'], {
            cwd: packagePath,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    }

    public static async isAvailable() {
        if (this.isYarnAvailable === undefined) {
            this.isYarnAvailable = await isAvailable('yarn -h');
        }

        return this.isYarnAvailable;
    }
}
