import { URLParser } from '../url-parser';

describe('URLParser', () => {
    describe('parse()', () => {
        it('should parse github file browser url', async () => {
            expect(
                URLParser.parse(
                    'https://github.com/joe/generators/tree/master/awesome.generator',
                ),
            ).toMatchObject({
                host: 'github.com',
                username: 'joe',
                repository: 'generators',
                branch: 'master',
                path: '/awesome.generator',
            });
        });
        it('should parse github file browser url', async () => {
            expect(
                URLParser.parse(
                    'https://github.com/joe/generators.git|master|/awesome.generator',
                ),
            ).toMatchObject({
                host: 'github.com',
                username: 'joe',
                repository: 'generators',
                branch: 'master',
                path: '/awesome.generator',
            });
        });
        it('should parse github file browser url', async () => {
            expect(
                URLParser.parse(
                    'git@github.com:joe/generators.git|master|/awesome.generator',
                ),
            ).toMatchObject({
                host: 'github.com',
                username: 'joe',
                repository: 'generators',
                branch: 'master',
                path: '/awesome.generator',
            });
        });
    });
});
