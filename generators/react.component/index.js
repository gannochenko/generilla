module.exports.Generator = class Generator {
    constructor(util) {
        this.util = util;
    }

    // setContext(context) {
    //     console.log(context);
    // }

    getName() {
        return 'React Component: TypeScript + testing';
    }

    getQuestions() {
        return [
            {
                message: 'What is the component name?',
                name: 'component_name',
            },
            {
                message: 'Add tests?',
                type: 'confirm',
                name: 'use_tests',
                default: true,
            },
        ];
    }

    refineAnswers(answers) {
        if (this.util.textConverter) {
            answers.component_name_pascal = this.util.textConverter.toPascal(
                answers.component_name,
            );
            answers.component_name = this.util.textConverter.toKebab(
                answers.component_name,
            );
        }

        return answers;
    }

    // onBeforeExecution() {
    //     console.log('Going to make some react component, huh?');
    // }
    //
    // onAfterExecution() {
    //     console.log('Enjoy your react component!');
    // }
};
