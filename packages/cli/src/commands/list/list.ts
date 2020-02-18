import { Command as CommanderCommand } from 'commander';
import { GeneratorList, describeGenerator } from '@generilla/core';

import { ActionCallback, CommandProcessor, Implements } from '../type';
import { Generilla } from '../../lib/generilla';

@Implements<CommandProcessor>()
export class CommandList {
    public static attach(
        program: CommanderCommand,
        actionCallback: ActionCallback,
    ) {
        program
            .command('list')
            .alias('ls')
            .description('Display a list of available generators')
            .action(() =>
                actionCallback({
                    command: this,
                    arguments: {},
                }),
            );
    }

    public static async process(generilla: Generilla) {
        await generilla.showPreFlight();
        const generators = await GeneratorList.getList(
            generilla.getGeneratorsPath(),
        );
        if (!generators.length) {
            console.log('No generators installed yet.');
        } else {
            console.log('Available generators:');
            console.log('');
            generators.forEach(generator =>
                console.log(`   * ${describeGenerator(generator)}`),
            );
            console.log('');
        }
    }
}
