import chalk from 'chalk';
// @ts-ignore
import clear from 'clear';
// @ts-ignore
import figlet from 'figlet';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import commander from 'commander';

import { GeneratorListItem, Debug } from '@generilla/core';
import { NOTHING, VERSION } from './constants';
import { Commands } from '../commands/commands';
import { CommandAction, CommandProcessor } from '../commands/type';
import { Nullable, ObjectLiteral } from '../type';
import { GIT, NPM } from '@generilla/core';

export class Generilla {
    private introShown = false;
    private preFlightShown = false;

    constructor(private generatorsPath: string) {}

    public getGeneratorsPath() {
        return this.generatorsPath;
    }

    public async run() {
        await fs.ensureDir(this.generatorsPath);
        if (!this.isObjectExist(this.generatorsPath)) {
            throw new Error(`No such directory: ${this.generatorsPath}`);
        }

        const command = this.processCLI();
        if (command.arguments.debug) {
            Debug.enable();
        }

        await command.command.process(this, command.arguments);
    }

    public async showIntro() {
        if (this.introShown) {
            return;
        }

        clear();

        await this.showPreFlight();
        console.log(
            chalk.red(
                figlet.textSync('Generilla', { horizontalLayout: 'full' }),
            ),
        );

        this.introShown = true;
    }

    public async selectGenerator(list: GeneratorListItem[]) {
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

    private processCLI(): CommandAction {
        const program = new commander.Command();

        let commandToRun: Nullable<CommandProcessor> = null;
        let commandArguments: ObjectLiteral = {};

        program
            .name('generilla')
            .version(VERSION, '-v, --version', 'output the current version')
            .description('Generilla: an extremely simple code generator runner')
            .option(
                '-m, --mould',
                'output a mould of just executed generation, so it is possible to repeat it again later in a non-interactive way',
            )
            .option('-d, --debug', 'output an additional debug info');

        Commands.attachCommands(program, command => {
            commandToRun = command.command;
            commandArguments = command.arguments || {};
        });

        program.parse(process.argv);

        if (!commandToRun) {
            commandToRun = Commands.getDefaultCommand();
        }

        return {
            command: commandToRun!,
            arguments: {
                ...commandArguments,
                mould: program.mould,
                debug: program.debug,
            },
        };
    }

    public async showPreFlight() {
        if (this.preFlightShown) {
            return;
        }
        this.preFlightShown = true;

        if (!(await GIT.isAvailable())) {
            console.log(
                chalk.yellow(
                    "* Warning! You don't have GIT installed. Some functionality may not work as expected.",
                ),
            );
            console.log(`  ${GIT.getInstallationInfo()}`);
        }
        if (!(await NPM.isAvailable())) {
            console.log(
                chalk.yellow(
                    "* Warning! You don't have neither Yarn nor NPM installed. Some functionality may not work as expected.",
                ),
            );
            console.log(`  ${NPM.getInstallationInfoYarn()}`);
            console.log(`  ${NPM.getInstallationInfoNPM()}`);
        }
    }
}
