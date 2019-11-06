import chalk from 'chalk';
// @ts-ignore
import clear from 'clear';
// @ts-ignore
import figlet from 'figlet';
import inquirer from 'inquirer';
import fs from 'fs';
import commander, { Command as CommanderCommand } from 'commander';

import {
    GeneratorList,
    GeneratorController,
    GeneratorListItem,
    ObjectLiteral,
} from '@generilla/core';
import { Command } from './type';
import { COMMAND_LIST, COMMAND_RUN } from './commands';
import { NOTHING, VERSION } from './constants';

export class Generilla {
    private introShown = false;

    constructor(private generatorsPath: string) {}

    public async run() {
        if (!this.isObjectExist(this.generatorsPath)) {
            throw new Error(`No such directory: ${this.generatorsPath}`);
        }

        const command = this.processCLI();

        if (command.name === COMMAND_RUN) {
            await this.runCommandRun(command);
        } else if (command.name === COMMAND_LIST) {
            await this.runCommandList(command);
        }
    }

    protected async runCommandRun(command: Command) {
        let generatorCode = command.args.generator as string;
        let generatorItem: GeneratorListItem | undefined;

        const list = await GeneratorList.getList(this.generatorsPath);
        let chosenFromList = false;

        if (!generatorCode) {
            this.showIntro();
            generatorCode = await this.selectGenerator(list!);

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

        this.showIntro();
        if (!chosenFromList) {
            console.log(
                `Running '${generatorItem.name}' [${generatorItem.code}] generator`,
            );
        }

        const generator = new GeneratorController(generatorItem!);

        const destination =
            command.args.output || process.env.GENERILLA_DST || process.cwd();
        const { originalAnswers } = await generator.runPipeline(
            destination,
            command.args,
        );

        console.log('Enjoy your brand new whatever you generated there!');

        if (command.args.mould) {
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

    protected async runCommandList(command: Command) {
        console.log('Available generators:');
        console.log('');
        (await GeneratorList.getList(this.generatorsPath)).forEach(generator =>
            console.log(`   * ${generator.name} [${generator.code}]`),
        );
        console.log('');
    }

    protected showIntro() {
        if (this.introShown) {
            return;
        }

        clear();
        console.log(
            chalk.red(
                figlet.textSync('Generilla', { horizontalLayout: 'full' }),
            ),
        );

        this.introShown = true;
    }

    protected async selectGenerator(list: GeneratorListItem[]) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'generator',
                message: 'Oh yes, I will create...',
                choices: this.formatGeneratorChoices(list),
            },
        ]);

        return answers.generator;
    }

    protected formatGeneratorChoices(list: GeneratorListItem[]) {
        const choices = list.map(generator => ({
            name: `${generator.name} [${generator.code}]`,
            value: generator.code,
        }));

        choices.unshift({
            name: 'ehhhh... nothing 😐',
            value: NOTHING,
        });

        return choices;
    }

    private isObjectExist(objectPath: string) {
        try {
            return fs.existsSync(objectPath);
        } catch (err) {
            return false;
        }
    }

    private processCLI() {
        const program = new commander.Command();

        let commandToRun = '';
        let commandArguments: ObjectLiteral = {};

        program
            .name('generilla')
            .version(VERSION, '-v, --version', 'Output the current version')
            .description('Generilla: an extremely simple code generator runner')
            .option(
                '-m, --mould',
                'Output a mould of just executed generation, so it is possible to repeat it again later in a non-interactive way',
            );

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

            // function to execute when command is uses
            .action((generator: string, command: CommanderCommand) => {
                commandToRun = COMMAND_RUN;
                commandArguments = {
                    generator,
                    answers: command.answers,
                    yes: command.yes,
                    output: command.output,
                };
            });

        program
            .command('list')
            .alias('l')
            .description('Display a list of available generators')

            // function to execute when command is uses
            .action(function() {
                commandToRun = COMMAND_LIST;
            });

        program.parse(process.argv);

        if (!commandToRun) {
            commandToRun = COMMAND_RUN;
        }

        return {
            name: commandToRun,
            args: { ...commandArguments, mould: program.mould },
        } as Command;
    }
}
