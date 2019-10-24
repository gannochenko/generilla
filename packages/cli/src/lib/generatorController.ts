import { GeneratorListItem } from './type';

export class GeneratorController {
    constructor(private generator: GeneratorListItem) {}

    async create() {

    }
}


// const template = new Template(path.join(generatorsPath, 'react.component', 'template'));
// (async () => {
//     await template.copy('/Users/sergeigannochenko/_generilla_tests', {
//         component_name: 'demo',
//         component_name_uc: 'Demo',
//         use_tests: true,
//     });
// })();
