import inquirer from 'inquirer';
import cloneDeep from 'clone-deep';
import { join, normalize } from 'path';
import {
    Dependencies,
    GenerationResult,
    Generator,
    GeneratorListItem,
    ObjectLiteral,
} from './type';
import { Template } from './template';
import { Interpolator } from './interpolator';
import { NPM } from './npm';

export class GeneratorController {
    constructor(private generator: GeneratorListItem) {}

    /**
     * This is the default pipeline
     */
    async runPipeline(destination: string, parameters?: ObjectLiteral) {
        const { path, generator } = this.generator;
        const result: GenerationResult = {
            originalAnswers: {},
            answers: {},
        };

        generator.context = {
            generatorPath: normalize(path),
            destinationPath: normalize(destination),
        };

        // before hook
        if (typeof generator.onBeforeExecution === 'function') {
            if ((await generator.onBeforeExecution()) === false) {
                return result;
            }
        }

        // ask questions
        let answers = await this.askQuestions(generator, parameters || {});
        generator.answers = answers;

        result.originalAnswers = cloneDeep(answers);
        generator.originalAnswers = cloneDeep(answers);

        // refine answers
        if (typeof generator.refineAnswers === 'function') {
            answers = await generator.refineAnswers(answers);
            generator.answers = answers;
        }

        result.answers = cloneDeep(generator.answers);

        // copy files
        const template = new Template(join(path, 'template'));
        await template.copy(destination, answers);

        // install dependencies
        if (typeof generator.getDependencies === 'function') {
            await this.install(
                destination,
                answers,
                await generator.getDependencies(answers),
            );
        }

        // install dev dependencies
        if (typeof generator.getDevDependencies === 'function') {
            await this.install(
                destination,
                answers,
                await generator.getDevDependencies(answers),
                true,
            );
        }

        // after hook
        if (typeof generator.onAfterExecution === 'function') {
            await generator.onAfterExecution(answers);
        }

        return result;
    }

    private async askQuestions(
        generator: Generator,
        parameters: ObjectLiteral,
    ) {
        let answers: ObjectLiteral = {};
        if (parameters.answers) {
            try {
                answers = JSON.parse(parameters.answers);
            } catch (error) {
                throw new Error(
                    'Illegal format of -a (--answers) option. It should be a serialized JSON object.',
                );
            }
        } else {
            if (typeof generator.getQuestions === 'function') {
                let questions = (await generator.getQuestions()).filter(
                    x => !!x,
                );
                if (questions && questions.length) {
                    let defaultAnswers: ObjectLiteral = {};
                    if (parameters.yes) {
                        defaultAnswers = this.getDefaultAnswers(questions);
                        questions = this.removeQuestionsWithDefault(questions);
                    }
                    if (questions.length) {
                        answers = {
                            ...defaultAnswers,
                            ...((await inquirer.prompt(
                                questions,
                            )) as ObjectLiteral),
                        };
                    }
                }
            }
        }

        return answers;
    }

    private getDefaultAnswers(questions: any[]) {
        const answers: ObjectLiteral = {};
        questions.forEach(question => {
            answers[question.name] = question.default;
        });

        return answers;
    }

    private removeQuestionsWithDefault(questions: any[]) {
        return questions.filter(question => !('default' in question));
    }

    private async install(
        destination: string,
        answers: ObjectLiteral,
        deps: Dependencies,
        dev = false,
    ) {
        const { packages, destination: localDestination } = deps || {};

        if (!packages || !packages.length) {
            return;
        }

        let cmdDestination = destination;
        if (localDestination) {
            cmdDestination = Interpolator.apply(
                join(cmdDestination, localDestination),
                answers,
            );
        }

        await NPM.add(cmdDestination, packages, dev);
    }
}
