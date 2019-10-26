import { Inquirer } from 'inquirer';
import { ObjectLiteral } from '../../src/lib/type';

interface GeneratorParams {
    inquirer?: Inquirer;
}

export class Generator {

    private inquirer?: Inquirer;

    public constructor({ inquirer }: GeneratorParams = {}) {
        if (inquirer) {
            this.inquirer = inquirer;
        }
    }

    public getName() {
        return 'React Component: TypeScript + testing';
    }

    getQuestions() {
        return [
            {
                message: 'What is the component name?',
                name: 'component_name',
            }
        ];
    }

    refineAnswers(answers: ObjectLiteral) {
        return {
            ...answers,
            component_name_uc: answers.component_name.toUpperCase(),
            use_tests: true,
        };
    }

    getDependencies() {
        return [];
    }

    getDevDependencies() {
        return [];
    }
}
