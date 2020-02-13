import { Command as CommanderCommand } from 'commander';
import {
    ReferenceParser,
    ReferenceParseResult,
    GeneratorManager,
} from '@generilla/core';

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
            .usage('add|update|removeGenerators repository_url')
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
                console.log(
                    '  $ generilla generator removeGenerators awesome.generator',
                );
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
        if (args.action === 'add') {
            let result: Nullable<ReferenceParseResult> = null;
            try {
                result = ReferenceParser.parse(args.reference);
            } catch (e) {
                console.error('Your repository looks really weird.');
                return;
            }

            const manager = new GeneratorManager(generilla.getGeneratorsPath());
            await manager.add(result);
        }
        if (args.action === 'update') {
            const manager = new GeneratorManager(generilla.getGeneratorsPath());
        }
        if (args.action === 'remove') {
            const manager = new GeneratorManager(generilla.getGeneratorsPath());
            manager.remove(args.reference);
        }
    }
}
