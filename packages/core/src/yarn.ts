import execa from 'execa';
import path from 'path';
import pathExists from 'path-exists';

export class Yarn {
    public static async install(packagePath: string) {
        if (!(await pathExists(path.join(packagePath, 'package.json')))) {
            return;
        }

        await execa('yarn', ['install'], {
            cwd: packagePath,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    }

    public static async isAvailable() {
        // todo
    }
}
