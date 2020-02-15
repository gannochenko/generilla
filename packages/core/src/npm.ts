import execa from 'execa';
import path from 'path';
import pathExists from 'path-exists';
import { isAvailable } from './util';

export class NPM {
    protected static isYarnAvailableCache: boolean;
    protected static isNPMAvailableCache: boolean;

    public static async install(packagePath: string) {
        if (!(await pathExists(path.join(packagePath, 'package.json')))) {
            return;
        }

        const yarnAvailable = await this.isYarnAvailable();
        const npmAvailable = await this.isNPMAvailable();

        if (!yarnAvailable && !npmAvailable) {
            throw new Error('Neither yarn nor npm is not available');
        }

        if (yarnAvailable) {
            await execa('yarn', ['install'], {
                cwd: packagePath,
                stdio: ['inherit', 'inherit', 'inherit'],
            });
            return;
        }

        if (npmAvailable) {
            console.log('Yarn is not available, switching to NPM');
            await execa('yarn', ['install'], {
                cwd: packagePath,
                stdio: ['inherit', 'inherit', 'inherit'],
            });
        }
    }

    public static async isAvailable() {
        return (await this.isYarnAvailable()) || this.isNPMAvailable();
    }

    public static async isYarnAvailable() {
        if (this.isYarnAvailableCache === undefined) {
            this.isYarnAvailableCache = await isAvailable('yarn -h');
        }

        return this.isYarnAvailableCache;
    }

    public static async isNPMAvailable() {
        if (this.isNPMAvailableCache === undefined) {
            this.isNPMAvailableCache = await isAvailable('npm -h');
        }

        return this.isNPMAvailableCache;
    }

    public static getInstallationInfoYarn() {
        return `To install Yarn, visit https://classic.yarnpkg.com/en/docs/install/`;
    }

    public static getInstallationInfoNPM() {
        return `To install NPM, visit https://www.npmjs.com/get-npm`;
    }
}
