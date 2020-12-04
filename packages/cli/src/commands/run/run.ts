import { Command as CommanderCommand } from 'commander';
import {
    GeneratorList,
    GeneratorListItem,
    GeneratorController,
    ReferenceParser,
    TextConverter,
} from '@generilla/core';
import {
    ActionCallback,
    CommandActionArguments,
    CommandProcessor,
    Implements,
} from '../type';
import { Generilla } from '../../lib/generilla';
import { NOTHING } from '../../lib/constants';
import { ObjectLiteral } from '../../type';

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

    public static checkForReference(reference: string) {
        try {
            const result = ReferenceParser.parse(reference);
            if (result.type === 'local' || result.type === 'remote') {
                return result;
            }
        } catch (error) {}

        return null;
    }

    public static async getGeneratorFromSource(reference: ObjectLiteral) {
        if (reference.type === 'remote') {
            console.error(
                'Obtaining remote generators without putting them into list currently is not supported.',
            );
            return null;
        }

        const textConverter = new TextConverter();
        const generatorListEntry = await GeneratorList.getGeneratorItem(
            '',
            // @ts-ignore
            {
                id: '',
                ...reference,
            },
            {
                textConverter,
            },
        );

        return new GeneratorController(generatorListEntry);
    }

    public static async getGeneratorFromList(
        generatorCode: string,
        generilla: Generilla,
    ) {
        let generatorItem: GeneratorListItem | undefined;

        const list = await GeneratorList.getList(generilla.getGeneratorsPath());
        if (!list.length) {
            console.log('No generators installed yet.');
            console.log(
                'Type "generilla generator add <reference>" to add an existing generator, or',
            );
            console.log('type "generilla scaffold" to make a brand new one!');
            return null;
        }

        let chosenFromList = false;

        if (!generatorCode) {
            await generilla.showIntro();
            generatorCode = await generilla.selectGenerator(list!);

            if (generatorCode === NOTHING) {
                console.log('Well then, see you round!');
                return null;
            }

            chosenFromList = true;
        }

        generatorItem = list!.find(item => item.code === generatorCode);
        if (!generatorItem) {
            console.log(
                'Emm... I am not aware of such generator to be out there.',
            );
            return null;
        }

        await generilla.showIntro();
        if (!chosenFromList) {
            console.log(
                `Running '${generatorItem.name}' [${generatorItem.code}] generator`,
            );
        }

        return new GeneratorController(generatorItem!);
    }

    public static async process(
        generilla: Generilla,
        args: CommandActionArguments,
    ) {
        let generatorCode = args.generator as string;

        let generator: GeneratorController | null;
        const result = this.checkForReference(generatorCode);
        if (result) {
            generator = await this.getGeneratorFromSource(result);
        } else {
            generator = await this.getGeneratorFromList(
                generatorCode,
                generilla,
            );
        }

        if (generator) {
            await generilla.showIntro();

            const destination =
                args.output || process.env.GENERILLA_DST || process.cwd();

            await generator.runPipeline(destination, args);

            console.log('Enjoy your brand new whatever you generated there!');

            // if (args.mould) {
            //     console.log(
            //         'Ah, yes. If you would like to run this process non-interactively, use the following command:',
            //     );
            //     console.log(
            //         `generilla run ${generatorItem.code} -a '${JSON.stringify(
            //             originalAnswers || {},
            //         )}'`,
            //     );
            // }
        }
    }
}
