import { Command as CommanderCommand } from 'commander';
import { GeneratorList } from '@generilla/core';

import {
    ActionCallback,
    CommandAction,
    CommandProcessor,
    Implements,
} from '../type';
import { Generilla } from '../../lib/generilla';

@Implements<CommandProcessor>()
export class CommandList {
    public static getCode() {
        return 'list';
    }

    public static attach(
        program: CommanderCommand,
        actionCallback: ActionCallback,
    ) {
        program
            .command('list')
            .alias('l')
            .description('Display a list of available generators')
            .action((generator: string, command: CommanderCommand) =>
                actionCallback({
                    command: this,
                    arguments: {},
                }),
            );
    }

    public static async process(generilla: Generilla) {
        console.log('Available generators:');
        console.log('');
        (
            await GeneratorList.getList(generilla.getGeneratorsPath())
        ).forEach(generator =>
            console.log(`   * ${generator.name} [${generator.code}]`),
        );
        console.log('');
    }
}
