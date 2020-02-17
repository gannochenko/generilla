module.exports.Generator = class Generator {
    getName() {
        return 'New generator "<%- generator_name %>"';
    }

    getQuestions() {
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

    refineAnswers(answers) {
        answers.package_name_kebab = this.util.textConverter.toKebab(
            answers.package_name,
        );

        return answers;
    }

    getDependencies(answers) {
        const { use_react } = answers;

        return {
            destination: '[package_name_kebab]/',
            packages: [!!use_react && 'react', !!use_react && 'react-dom'],
        };
    }
};
