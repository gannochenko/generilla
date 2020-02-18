import { Command as CommanderCommand } from 'commander';
import {
    GeneratorList,
    GeneratorListItem,
    GeneratorController,
} from '@generilla/core';
import {
    ActionCallback,
    CommandActionArguments,
    CommandProcessor,
    Implements,
} from '../type';
import { Generilla } from '../../lib/generilla';
import { NOTHING } from '../../lib/constants';

@Implements<CommandProcessor>()
export class CommandRun {
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
                    command: this,
                    arguments: {
                        generator,
                        answers: command.answers,
                        yes: command.yes,
                        output: command.output,
                    },
                }),
            );
    }

    public static async process(
        generilla: Generilla,
        args: CommandActionArguments,
    ) {
        let generatorCode = args.generator as string;
        let generatorItem: GeneratorListItem | undefined;

        const list = await GeneratorList.getList(generilla.getGeneratorsPath());
        if (!list.length) {
            console.log('No generators installed yet.');
            console.log(
                'Type "generilla generator add <reference>" to add an existing generator, or',
            );
            console.log('type "generilla scaffold" to make a brand new one!');
            return;
        }

        let chosenFromList = false;

        if (!generatorCode) {
            await generilla.showIntro();
            generatorCode = await generilla.selectGenerator(list!);

            if (generatorCode === NOTHING) {
                console.log('Well then, see you round!');
                return;
            }

            chosenFromList = true;
        }

        generatorItem = list!.find(item => item.code === generatorCode);
        if (!generatorItem) {
            console.log(
                'Emm... I am not aware of such generator to be out there.',
            );
            return;
        }

        await generilla.showIntro();
        if (!chosenFromList) {
            console.log(
                `Running '${generatorItem.name}' [${generatorItem.code}] generator`,
            );
        }

        const generator = new GeneratorController(generatorItem!);

        const destination =
            args.output || process.env.GENERILLA_DST || process.cwd();
        const { originalAnswers } = await generator.runPipeline(
            destination,
            args,
        );

        console.log('Enjoy your brand new whatever you generated there!');

        if (args.mould) {
            console.log(
                'Ah, yes. If you would like to run this process non-interactively, use the following command:',
            );
            console.log(
                `generilla run ${generatorItem.code} -a '${JSON.stringify(
                    originalAnswers || {},
                )}'`,
            );
        }
    }
}
