module.exports.Generator = class Generator {
    constructor(util) {
        this.util = util;
    }

    getName() {
        return 'React Component: TypeScript + testing';
    }

    getQuestions() {
        return [
            {
                message: 'What is the component name?',
                name: 'component_name',
            },
        ];
    }

    refineAnswers(answers) {
        if (this.util.textConverter) {
            answers.component_name_uc = this.util.textConverter.toPascal(
                answers.component_name,
            );
            answers.component_name = this.util.textConverter.toKebab(
                answers.component_name,
            );
        }

        return {
            ...answers,
            use_tests: true,
        };
    }
};
