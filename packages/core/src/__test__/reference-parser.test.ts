import { ReferenceParser } from '../reference-parser';

describe('ReferenceParser', () => {
    describe('parse()', () => {
        it('should parse simple github repository url', async () => {
            expect(
                ReferenceParser.parse('https://github.com/joe/generator'),
            ).toMatchObject({
                type: 'remote',
                account: 'joe',
                repo: 'generator',
                branch: '',
                path: '',
                repository: 'https://github.com/joe/generator.git',
                repositorySSH: 'git@github.com:joe/generator.git',
            });
        });
        it('should parse github file browser url with sub-folders', async () => {
            expect(
                ReferenceParser.parse(
                    'https://github.com/joe/generators/tree/master/awesome.generator/foo/bar',
                ),
            ).toMatchObject({
                type: 'remote',
                account: 'joe',
                repo: 'generators',
                branch: 'master',
                path: '/awesome.generator/foo/bar',
                repository: 'https://github.com/joe/generators.git',
                repositorySSH: 'git@github.com:joe/generators.git',
            });
        });
        it('should parse "http-url" with separator, 3 parts', async () => {
            expect(
                ReferenceParser.parse(
                    'https://github.com/joe/generators.git|master|/awesome.generator/foo/bar',
                ),
            ).toMatchObject({
                type: 'remote',
                branch: 'master',
                path: '/awesome.generator/foo/bar',
                account: 'joe',
                repo: 'generators',

                repository: 'https://github.com/joe/generators.git',
                repositorySSH: 'git@github.com:joe/generators.git',
            });
        });
        it('should parse "http-url" with separator, 2 parts', async () => {
            expect(
                ReferenceParser.parse(
                    'https://github.com/joe/generators.git|/awesome.generator/foo/bar',
                ),
            ).toMatchObject({
                type: 'remote',
                branch: '',
                path: '/awesome.generator/foo/bar',
                account: 'joe',
                repo: 'generators',

                repository: 'https://github.com/joe/generators.git',
                repositorySSH: 'git@github.com:joe/generators.git',
            });
        });
        it('should parse "git-url" with separator, 3 parts', async () => {
            expect(
                ReferenceParser.parse(
                    'git@github.com:joe/generators.git|master|/awesome.generator/foo/bar',
                ),
            ).toMatchObject({
                type: 'remote',
                branch: 'master',
                path: '/awesome.generator/foo/bar',
                account: 'joe',
                repo: 'generators',

                repository: 'https://github.com/joe/generators.git',
                repositorySSH: 'git@github.com:joe/generators.git',
            });
        });
    });
});
