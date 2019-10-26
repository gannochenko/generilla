import { GeneratorListItem, ObjectLiteral } from './type';
import inquirer from 'inquirer';

export class GeneratorController {
    constructor(private generator: GeneratorListItem) {}

    async runPipeline() {
        const { path, generator } = this.generator;

        // run the default pipeline

        // ask questions
        let answers: ObjectLiteral = {};
        if (typeof generator.getQuestions == 'function') {
            const questions = await generator.getQuestions();
            if (questions.length) {
                answers = await inquirer.prompt(questions) as any[];
            }
        }

        if (typeof generator.refineAnswers == 'function') {
            answers = await generator.refineAnswers(answers);
        }
        console.log(answers);

        // refine the result

        // copy files

        // install dependencies

        // install dev dependencies
    }
}


// const template = new Template(path.join(generatorsPath, 'react.component', 'template'));
// (async () => {
//     await template.copy('/Users/sergeigannochenko/_generilla_tests', {
//         component_name: 'demo',
//         component_name_uc: 'Demo',
//         use_tests: true,
//     });
// })();
