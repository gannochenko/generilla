module.exports = {
    verbose: true,
    rootDir: '../src',
    setupFiles: ['<rootDir>/../jest/setup.ts'],
    testRegex: '\\.test\\.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
