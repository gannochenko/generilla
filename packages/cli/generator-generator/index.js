const path = require('path');
const GIT = require('@generilla/core').GIT;

module.exports.Generator = class Generator {
    getName() {
        return 'Generator generator';
    }

    getQuestions() {
        return [
            {
                message: 'What is the generator name?',
                name: 'generator_name',
            },
            {
                type: 'confirm',
                message: 'Would you like to use GIT?',
                name: 'use_git',
                default: true,
            },
        ];
    }

    refineAnswers(answers) {
        answers.generator_name_kebab = this.util.textConverter.toKebab(
            answers.generator_name,
        );

        return answers;
    }

    async onAfterExecution() {
        if (!this.answers.use_git) {
            return;
        }

        if (await GIT.isAvailable()) {
            await this.util.execa('git', ['init'], {
                cwd: path.join(
                    this.context.destinationPath,
                    this.answers.generator_name_kebab,
                ),
                stdio: ['inherit', 'inherit', 'inherit'],
            });
        }
    }
};
