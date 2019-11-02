import chalk from 'chalk';
// @ts-ignore
import clear from 'clear';
// @ts-ignore
import figlet from 'figlet';
import inquirer from 'inquirer';
import commander, { Command as CommanderCommand } from 'commander';

import { GeneratorList } from './generatorList';
import { Command, GeneratorListItem, ObjectLiteral } from './type';
import fs from 'fs';
import { GeneratorController } from './generator-controller';
import { COMMAND_LIST, COMMAND_RUN } from './commands';
import { NOTHING } from './constants';

export class Generilla {
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
        const generatorCode = command.args.generator as string;
        let generatorItem: GeneratorListItem | undefined;
        if (generatorCode) {
            generatorItem = await GeneratorList.getByCode(
                this.generatorsPath,
                generatorCode,
            );
            if (!generatorItem) {
                console.log(
                    'Emm... I am not aware of such generator to be out there.',
                );
                return;
            }
            this.showIntro();
        } else {
            this.showIntro();

            const list = await GeneratorList.getList(this.generatorsPath);
            const generatorPath = await this.selectGenerator(list!);

            if (generatorPath === NOTHING) {
                console.log('Well then, see you round!');
                return;
            }

            generatorItem = list!.find(item => item.path === generatorPath);
        }

        console.log(generatorItem);

        const generator = new GeneratorController(generatorItem!);

        const destination = process.env.GENERILLA_DST || process.cwd();
        await generator.runPipeline(destination);

        console.log('Enjoy your brand new whatever you generated there!');
    }

    protected async runCommandList(command: Command) {}

    protected showIntro() {
        clear();
        console.log(
            chalk.red(
                figlet.textSync('Generilla', { horizontalLayout: 'full' }),
            ),
        );
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
            name: generator.name,
            value: generator.path,
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
            .version('1.0.0', '-v, --version', 'output the current version')
            .description(
                'Generilla: an extremely simple code generator runner',
            );

        program
            .command('run [generator]')
            .alias('r')
            .description('Run a specified generator')
            .option('-a, --answers <answers>', 'Answers as JSON object')
            .option('-y, --yes', 'Use the default answers when possible')
            .option('-o, --output', 'Target folder')

            // function to execute when command is uses
            .action((generator: string, command: CommanderCommand) => {
                commandToRun = COMMAND_RUN;
                commandArguments = {
                    generator,
                    answers: command.answers,
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
            args: commandArguments,
        } as Command;
    }
}
