module.exports.Generator = class Generator {
    constructor(util) {
        this.util = util;
    }

    getName() {
        return 'Node App';
    }

    getQuestions() {
        return [
            {
                message: 'What is the package name?',
                name: 'package_name',
            },
        ];
    }

    getDependencies() {
        return {
            destination: '[package_name]/',
            packages: ['express', 'helmet'],
        };
    }

    getDevDependencies() {
        return {
            destination: '[package_name]/',
            packages: ['typescript', 'babel'],
        };
    }
};
