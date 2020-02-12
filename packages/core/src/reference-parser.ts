import { ReferenceParseResult } from './type';

export class ReferenceParser {
    public static parse(url: string): ReferenceParseResult {
        const trimmedUrl = url.trim();
        if (trimmedUrl.indexOf('|') >= 0) {
            const parts = url.trim().split('|');
            if (parts.length === 3) {
                return {
                    repository: parts[0],
                    branch: parts[1],
                    path: parts[2],
                };
            }
        } else {
            const match = trimmedUrl.match(
                /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)$/,
            );
            if (match) {
                return {
                    host: 'github.com',
                    account: match[1],
                    repo: match[2],
                    repository: `https://github.com/${match[1]}/${match[2]}.git`,
                    branch: match[3],
                    path: `/${match[4]}`,
                };
            }
        }

        throw new Error('Illegal reference');
    }
}
