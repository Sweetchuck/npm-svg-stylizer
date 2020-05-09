module.exports = {
    verbose: true,
    roots: [
        '<rootDir>'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '\\.test\\.tsx?$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'index.ts'
    ],
    coverageDirectory: 'log/coverage',
    coverageReporters: [
        'html',
        'json',
        'lcov',
    ],
};
