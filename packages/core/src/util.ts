import execa from 'execa';

export const isAvailable = async (cmd: string) => {
    const cmdParts = cmd.trim().split(' ');
    if (!cmdParts.length) {
        return false;
    }

    const file = cmdParts.shift();
    return execa(file!, cmdParts, {
        stdio: 'ignore',
    })
        .then(() => true)
        .catch(e => {
            // @ts-ignore
            return e.code !== 'ENOENT';
        });
};
