module.exports.Generator = class Generator {
    getName() {
        // this is the name your generator will appear in the list under
        return '<%- generator_name %>';
    }

    async onBeforeExecution() {
        // returning "false" will stop the process
        console.log('onBeforeExecution()');
        return true;
    }

    async getQuestions() {
        // see inquirer docs to get more information on the format of questions
        // https://www.npmjs.com/package/inquirer#questions
        return [
            {
                message: 'What is the package name?',
                name: 'package_name',
            },
            {
                type: 'confirm',
                name: 'use_react',
                message: 'Do you need React?',
                default: false,
            },
        ];
    }

    async refineAnswers(answers) {
        // here it is possible to alter some answers before the generation starts
        answers.package_name_kebab = this.util.textConverter.toKebab(
            answers.package_name,
        );

        return answers;
    }

    async getDependencies(answers) {
        // list your dependencies here
        const { use_react } = answers;

        return {
            destination: '[package_name_kebab]/',
            packages: [!!use_react && 'react', !!use_react && 'react-dom'],
        };
    }

    async getDevDependencies(answers) {
        // list your dev dependencies here
        const { use_react } = answers;

        return {
            destination: '[package_name_kebab]/',
            packages: ['jest', !!use_react && '@testing-library/react'],
        };
    }

    async onAfterExecution() {
        // do something after the code gets generated
        console.log('onAfterExecution()');
    }
};
