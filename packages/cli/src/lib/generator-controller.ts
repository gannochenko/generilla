import { Dependencies, GeneratorListItem, ObjectLiteral } from './type';
import inquirer from 'inquirer';
import { join, normalize } from 'path';
import { Template } from './template';
import execa from 'execa';
import { Interpolator } from './interpolator';

export class GeneratorController {
    constructor(private generator: GeneratorListItem) {}

    /**
     * This is the default pipeline
     */
    async runPipeline(destination: string) {
        const { path, generator } = this.generator;

        // before hook
        if (typeof generator.setContext == 'function') {
            await generator.setContext({
                generatorPath: normalize(path),
                destinationPath: normalize(destination),
            })
        }

        // before hook
        if (typeof generator.onBeforeExecution == 'function') {
            if(await generator.onBeforeExecution() === false) {
                return;
            }
        }

        // ask questions
        let answers: ObjectLiteral = {};
        if (typeof generator.getQuestions == 'function') {
            const questions = await generator.getQuestions();
            if (questions.length) {
                answers = await inquirer.prompt(questions) as any[];
            }
        }

        // refine answers
        if (typeof generator.refineAnswers == 'function') {
            answers = await generator.refineAnswers(answers);
        }

        // copy files
        const template = new Template(join(path, 'template'));
        await template.copy(destination, answers);

        // install dependencies
        if (typeof generator.getDependencies === 'function') {
            await this.install(destination, answers, await generator.getDependencies(answers));
        }

        // install dev dependencies
        if (typeof generator.getDevDependencies === 'function') {
            await this.install(destination, answers, await generator.getDevDependencies(answers), ['--dev']);
        }

        // after hook
        if (typeof generator.onAfterExecution == 'function') {
            await generator.onAfterExecution(answers);
        }
    }

    private async install(destination: string, answers: ObjectLiteral, deps: Dependencies, args: string[] = []) {
        if (deps && deps.packages && deps.packages.length) {

            const localDestination = deps.destination;
            if (localDestination) {
                destination = Interpolator.apply(join(destination, localDestination), answers);
            }

            await execa('yarn', ['add', ...deps.packages, ...args], {
                cwd: destination,
                stdio: ['inherit', 'inherit', 'inherit']
            });
        }
    }
}
