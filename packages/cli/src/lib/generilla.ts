import chalk from 'chalk';
// @ts-ignore
import clear from 'clear';
// @ts-ignore
import figlet from 'figlet';
import inquirer from 'inquirer';
import program from 'commander';

import { GeneratorList } from './generatorList';
import { GeneratorListItem } from './type';
import fs from "fs";
import { GeneratorController } from './generator-controller';

const NOTHING = '__nothing__';

export class Generilla {
    constructor(private generatorsPath: string) {}

    public async run() {
        if (!this.isObjectExist(this.generatorsPath)) {
            throw new Error(`No such directory: ${this.generatorsPath}`);
        }

        clear();
        this.showIntro();

        const list = await GeneratorList.getList(this.generatorsPath);
        const generatorPath = await this.selectGenerator(list!);

        if (generatorPath === NOTHING) {
            console.log('Well then, see you round!');
            return;
        }

        const generatorItem = list!.find(item => item.path === generatorPath);
        const generator = new GeneratorController(generatorItem!);

        const destination = '/Users/sergeigannochenko/proj/generilla/_output'; // process.cwd();
        await generator.runPipeline(destination);

        console.log('Enjoy your brand new whatever you generated there!');
    }

    protected showIntro() {
        console.log(
            chalk.red(
                figlet.textSync('Generilla', { horizontalLayout: 'full' })
            )
        );
    }

    protected async selectGenerator(list: GeneratorListItem[]) {
        const answers = await inquirer
            .prompt([
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
            value: generator.path
        }));

        choices.unshift({
            name: 'ehhhh... nothing 😐',
            value: NOTHING
        });

        return choices;
    }

    private isObjectExist(objectPath: string) {
        try {
            return fs.existsSync(objectPath);
        } catch(err) {
            return false;
        }
    }
}

// program
//     .version('0.0.1')
//     .description("An example Generilla for ordering pizza's")
//     .option('-p, --peppers', 'Add peppers')
//     .option('-P, --pineapple', 'Add pineapple')
//     .option('-b, --bbq', 'Add bbq sauce')
//     .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
//     .option('-C, --no-cheese', 'You do not want any cheese')
//     .parse(process.argv);

// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbq) console.log('  - bbq');
// const cheese: string = true === program.cheese ? 'marble' : program.cheese || 'no';
// console.log('  - %s cheese', cheese);
