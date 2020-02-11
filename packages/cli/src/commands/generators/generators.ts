import { Command as CommanderCommand } from 'commander';

import { ActionCallback, CommandProcessor, Implements } from '../type';
import { Generilla } from '../../lib/generilla';
import { ObjectLiteral } from '../../type';

@Implements<CommandProcessor>()
export class CommandGenerator {
    public static attach(
        program: CommanderCommand,
        actionCallback: ActionCallback,
    ) {
        program
            .command('generator [action] [url]')
            .usage('add|update|remove repository_url')
            .alias('g')
            .alias('gen')
            .description('Manage installed generators')
            .on('--help', () => {
                console.log('');
                console.log('Examples:');
                console.log(
                    '  $ generilla generator add https://github.com/joe/generators/tree/master/awesome.generator',
                );
                console.log('  $ generilla generator update awesome.generator');
                console.log('  $ generilla generator remove awesome.generator');
            })
            .action((action: string, url: string) =>
                actionCallback({
                    command: this,
                    arguments: {
                        action,
                        url,
                    },
                }),
            );
    }

    public static async process(generilla: Generilla, args: ObjectLiteral) {
        console.log(args);
    }
}
