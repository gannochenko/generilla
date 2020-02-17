import { Command as CommanderCommand } from 'commander';
import {
    ReferenceParser,
    ReferenceParseResult,
    GeneratorRecordManager,
    GeneratorList,
    GeneratorController,
} from '@generilla/core';
import inquirer from 'inquirer';
import path from 'path';

import { ActionCallback, CommandProcessor, Implements } from '../type';
import { Generilla } from '../../lib/generilla';
import { Nullable, ObjectLiteral } from '../../type';

@Implements<CommandProcessor>()
export class CommandGenerator {
    public static attach(
        program: CommanderCommand,
        actionCallback: ActionCallback,
    ) {
        program
            .command('generator [action] [reference]')
            .usage('add|update|remove|scaffold reference')
            .alias('g')
            .alias('gen')
            .description('Manage installed generators')
            .on('--help', () => {
                console.log('');
                console.log('Examples:');
                console.log(
                    '  $ generilla generator add https://github.com/joe/generators/tree/master/awesome.generator',
                );
                console.log(
                    '  $ generilla generator add https://github.com/joe/generators.git|master|/awesome.generator',
                );
                console.log(
                    '  $ generilla generator add git@github.com:joe/generators.git|master|/awesome.generator',
                );
                console.log('  $ generilla generator update awesome.generator');
                console.log('  $ generilla generator remove awesome.generator');
            })
            .action((action: string, reference: string) =>
                actionCallback({
                    command: this,
                    arguments: {
                        action,
                        reference,
                    },
                }),
            );
    }

    public static async process(generilla: Generilla, args: ObjectLiteral) {
        await generilla.showPreFlight();
        if (args.action === 'add') {
            let result: Nullable<ReferenceParseResult> = null;
            try {
                result = ReferenceParser.parse(args.reference);
            } catch (e) {
                console.error(
                    'The generator reference you provided looks really weird.',
                );
                return;
            }

            const manager = new GeneratorRecordManager(
                generilla.getGeneratorsPath(),
            );
            return manager.add(result);
        }
        if (args.action === 'update' || args.action === 'up') {
            const proceed = await this.promptProceed(
                generilla,
                args,
                'Will be updated #COUNT# generator(s). Proceed?',
                'remote',
            );
            if (proceed) {
                const manager = new GeneratorRecordManager(
                    generilla.getGeneratorsPath(),
                );
                await manager.update(args.reference);
            }

            return;
        }
        if (args.action === 'remove' || args.action === 'rm') {
            const proceed = await this.promptProceed(
                generilla,
                args,
                'Will be removed #COUNT# generator(s). Proceed?',
            );
            if (proceed) {
                const manager = new GeneratorRecordManager(
                    generilla.getGeneratorsPath(),
                );
                await manager.remove(args.reference);
            }

            return;
        }
        if (args.action === 'scaffold' || args.action === 'mk') {
            const packageRoot = path.join(__dirname, '../../../');
            const generatorItem = await GeneratorList.getGeneratorItem(
                packageRoot,
                {
                    id: 'generator-generator',
                    branch: '',
                    path: '',
                    type: 'local',
                },
            );

            if (!generatorItem) {
                throw new Error('Generator generator is not accessible');
            }

            const generator = new GeneratorController(generatorItem);

            const destination = process.env.GENERILLA_DST || process.cwd();
            await generator.runPipeline(destination, args);

            return;
        }

        throw new Error(`Unknown action: ${args.action}`);
    }

    private static async promptProceed(
        generilla: Generilla,
        args: ObjectLiteral,
        question: string,
        type?: string,
    ) {
        const generators = await GeneratorList.getList(
            generilla.getGeneratorsPath(),
            args.reference,
            type,
        );

        const count = generators.length;
        if (count) {
            const answers = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: question.replace('#COUNT#', count.toString()),
                },
            ]);
            if (answers.proceed) {
                return true;
            }
        } else {
            console.log('No generators match the given criteria');
        }

        return false;
    }
}
