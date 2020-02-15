import execa from 'execa';
import { isAvailable } from './util';

export class GIT {
    protected static isGitAvailable: boolean;

    public static async clone(url: string, cwd: string, as: string) {
        if (!(await this.isAvailable())) {
            throw new Error('Not available');
        }

        await execa('git', ['clone', url, as], {
            cwd,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    }

    public static async checkout(path: string, branch: string) {
        if (!(await this.isAvailable())) {
            throw new Error('Not available');
        }

        await execa('git', ['fetch', 'origin', branch], {
            cwd: path,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
        await execa('git', ['checkout', branch], {
            cwd: path,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    }

    public static async pull(path: string, branch: string) {
        if (!(await this.isAvailable())) {
            throw new Error('Not available');
        }

        await execa('git', ['pull', 'origin', branch], {
            cwd: path,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    }

    public static async isAvailable() {
        if (this.isGitAvailable === undefined) {
            this.isGitAvailable = await isAvailable('git -h');
        }

        return this.isGitAvailable;
    }

    public static getInstallationInfo() {
        return `To install GIT, visit https://git-scm.com/book/en/v2/Getting-Started-Installing-Git`;
    }
}
