module.exports.Generator = class Generator {
    constructor(util) {
        this.util = util;
    }

    getName() {
        return 'Generator generator';
    }

    getQuestions() {
        return [
            {
                message: 'What is the generator name?',
                name: 'generator_name',
            },
        ];
    }

    refineAnswers(answers) {
        answers.generator_name_kebab = this.util.textConverter.toKebab(
            answers.generator_name,
        );

        return answers;
    }
};
