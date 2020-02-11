import { Command as CommanderCommand } from 'commander';
import { ActionCallback, CommandProcessor, Implements } from '../type';

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
                    code: this.getCode(),
                }),
            );
    }

    public static process() {}
}
