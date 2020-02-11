import { Command as CommanderCommand } from 'commander';
import { ActionCallback, CommandProcessor, Implements } from '../type';

@Implements<CommandProcessor>()
export class CommandRun {
    public static getCode() {
        return 'run';
    }

    public static attach(
        program: CommanderCommand,
        actionCallback: ActionCallback,
    ) {
        program
            .command('run [generator]')
            .alias('r')
            .description('Run a specified generator')
            .option('-a, --answers <answers>', 'Answers as JSON object')
            .option('-y, --yes', 'Use the default answers when possible')
            .option(
                '-o, --output <output>',
                'Specify an alternative target folder, rather than CWD',
            )
            .action((generator: string, command: CommanderCommand) =>
                actionCallback({
                    code: this.getCode(),
                    arguments: {
                        generator,
                        answers: command.answers,
                        yes: command.yes,
                        output: command.output,
                    },
                }),
            );
    }

    public static process() {}
}
