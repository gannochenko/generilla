import { ReferenceParser } from '../reference-parser';

describe('ReferenceParser', () => {
    describe('parse()', () => {
        it('should parse github file browser url', async () => {
            expect(
                ReferenceParser.parse(
                    'https://github.com/joe/generators/tree/master/awesome.generator/foo/bar',
                ),
            ).toMatchObject({
                host: 'github.com',
                account: 'joe',
                repo: 'generators',
                branch: 'master',
                path: '/awesome.generator/foo/bar',
                repository: 'https://github.com/joe/generators.git',
            });
        });
        it('should parse "url" with separator, 3 parts', async () => {
            expect(
                ReferenceParser.parse(
                    'https://github.com/joe/generators.git|master|/awesome.generator/foo/bar',
                ),
            ).toMatchObject({
                repository: 'https://github.com/joe/generators.git',
                branch: 'master',
                path: '/awesome.generator/foo/bar',
            });
        });
        it('should parse github file browser url', async () => {
            expect(
                ReferenceParser.parse(
                    'git@github.com:joe/generators.git|master|/awesome.generator/foo/bar',
                ),
            ).toMatchObject({
                repository: 'git@github.com:joe/generators.git',
                branch: 'master',
                path: '/awesome.generator/foo/bar',
            });
        });
    });
});
