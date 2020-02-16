import { ReferenceParseResult } from './type';
import fs from 'fs-extra';

export class ReferenceParser {
    public static parse(url: string): ReferenceParseResult {
        let isDir = false;
        try {
            isDir = fs.lstatSync(url).isDirectory();
        } catch (e) {
            isDir = false;
        }

        if (isDir) {
            return {
                type: 'local',
                path: url,
            };
        } else {
            const trimmedUrl = url.trim();
            if (trimmedUrl.indexOf('|') >= 0) {
                const parts = url.trim().split('|');
                if (parts.length === 3) {
                    // parse repo
                    const match = parts[0].match(
                        /^(https:\/\/|git@)github\.com(:|\/)([^\/]+)\/([^\/]+)\.git$/,
                    );

                    if (match) {
                        return {
                            type: 'remote',
                            account: match[3],
                            repo: match[4],
                            branch: parts[1],
                            path: parts[2],

                            repository: `https://github.com/${match[3]}/${match[4]}.git`,
                            repositorySSH: `git@github.com:${match[3]}/${match[4]}.git`,
                        };
                    }
                }
            } else {
                const match = trimmedUrl.match(
                    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)$/,
                );
                if (match) {
                    return {
                        type: 'remote',
                        account: match[1],
                        repo: match[2],
                        branch: match[3],
                        path: `/${match[4]}`,

                        repository: `https://github.com/${match[1]}/${match[2]}.git`,
                        repositorySSH: `git@github.com:${match[1]}/${match[2]}.git`,
                    };
                }
            }
        }

        throw new Error('Illegal reference');
    }
}
