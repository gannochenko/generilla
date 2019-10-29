module.exports.Generator = class Generator {
    constructor(util) {
        this.util = util;
    }

    getName() {
        return 'Cool README template';
    }

    getQuestions() {
        return [
            {
                name: 'github_account_name',
                message: 'What is the GitHub account name?',
            },
            {
                name: 'repository_name',
                message: 'What is the repository name?',
            },
            {
                name: 'project_name',
                message: 'What is the project name?',
            },
        ];
    }
};
