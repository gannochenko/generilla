#!/usr/bin/env node

import chalk from 'chalk';
// @ts-ignore
import figlet from 'figlet';
// @ts-ignore
import clear from 'clear';
import program from 'commander';
import path from 'path';

import { Template } from './lib/template';

clear();
console.log(
    chalk.red(
        figlet.textSync('Generilla', { horizontalLayout: 'full' })
    )
);

// program
//     .version('0.0.1')
//     .description("An example CLI for ordering pizza's")
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

const generatorsPath = path.join(__dirname, '../generators');

const template = new Template(path.join(generatorsPath, 'react.component', 'template'));
(async () => {
    await template.copy('/Users/sergeigannochenko/_generilla_tests', {
        component_name: 'suck',
        use_tests: true,
    });
})();
