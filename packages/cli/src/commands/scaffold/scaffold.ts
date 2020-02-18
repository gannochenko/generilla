import { Command as CommanderCommand } from 'commander';
import {
    GeneratorRecordManager,
    GeneratorList,
    GeneratorController,
    TextConverter,
} from '@generilla/core';
import path from 'path';

import { ActionCallback, CommandProcessor, Implements } from '../type';
import { Generilla } from '../../lib/generilla';
import { Nullable, ObjectLiteral } from '../../type';

@Implements<CommandProcessor>()
export class CommandScaffold {
    public static attach(
        program: CommanderCommand,
        actionCallback: ActionCallback,
    ) {
        program
            .command('scaffold')
            .alias('sc')
            .description('Create a generator boilerplate in the current folder')
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

        const textConverter = new TextConverter();

        const packageRoot = path.join(__dirname, '../../../');
        const generatorItem = await GeneratorList.getGeneratorItem(
            packageRoot,
            {
                id: 'generator-generator',
                branch: '',
                path: '',
                type: 'local',
            },
            {
                textConverter,
            },
        );

        if (!generatorItem) {
            throw new Error('Generator generator is not accessible');
        }

        const generator = new GeneratorController(generatorItem);

        const destination = process.env.GENERILLA_DST || process.cwd();
        const { answers } = await generator.runPipeline(destination, args);

        const manager = new GeneratorRecordManager(
            generilla.getGeneratorsPath(),
        );
        await manager.add({
            path: path.join(destination, answers.generator_name_kebab),
            type: 'local',
        });

        console.log(
            `A boilerplate has been created. Now go to ${answers.generator_name_kebab}/ and make something beautiful ❤️`,
        );
    }
}
