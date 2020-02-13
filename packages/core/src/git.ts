import execa from 'execa';

export class GIT {
    public static async clone(url: string, cwd: string, as: string) {
        await execa('git', ['clone', url, as], {
            cwd,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    }

    public static async checkout(path: string, branch: string) {
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
        await execa('git', ['pull', 'origin', branch], {
            cwd: path,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    }

    public static async isAvailable() {
        // todo
    }
}
