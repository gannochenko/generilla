module.exports = {
    verbose: true,
    rootDir: '../src',
    setupFiles: ['<rootDir>/../jest/setup.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '\\.test\\.ts$',
};
