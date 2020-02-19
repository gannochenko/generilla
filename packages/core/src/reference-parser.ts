import fs from 'fs-extra';
import { ReferenceParseResult } from './type';

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
                    const match = this.parseGithubURL(parts[0]);

                    if (match) {
                        return {
                            type: 'remote',
                            account: match[3],
                            repo: match[4],
                            branch: parts[1],
                            path: parts[2],
                            ...this.makeGithubURLs(match[3], match[4]),
                        };
                    }
                } else if (parts.length === 2) {
                    // parse repo
                    const match = this.parseGithubURL(parts[0]);

                    if (match) {
                        return {
                            type: 'remote',
                            account: match[3],
                            repo: match[4],
                            branch: '',
                            path: parts[1],
                            ...this.makeGithubURLs(match[3], match[4]),
                        };
                    }
                }
            } else {
                let match = trimmedUrl.match(
                    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)$/,
                );
                if (match) {
                    return {
                        type: 'remote',
                        account: match[1],
                        repo: match[2],
                        branch: match[3],
                        path: `/${match[4]}`,
                        ...this.makeGithubURLs(match[1], match[2]),
                    };
                }

                match = trimmedUrl.match(
                    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/,
                );
                if (match) {
                    return {
                        type: 'remote',
                        account: match[1],
                        repo: match[2],
                        branch: '',
                        path: '',
                        ...this.makeGithubURLs(match[1], match[2]),
                    };
                }
            }
        }

        throw new Error('Illegal reference');
    }

    private static parseGithubURL(url: string) {
        return url.match(
            /^(https:\/\/|git@)github\.com(:|\/)([^\/]+)\/([^\/]+)\.git$/,
        );
    }

    private static makeGithubURLs(account: string, repository: string) {
        return {
            repository: `https://github.com/${account}/${repository}.git`,
            repositorySSH: `git@github.com:${account}/${repository}.git`,
        };
    }
}
