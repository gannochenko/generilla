export class Generator {
    public getName() {
        return 'React Component: TypeScript + testing';
    }

    getQuestions() {
        return [
            {
                code: 'component_name',
                text: 'What is the component name?',
            },
        ];
    }

    getDependences() {
        return [];
    }

    getDevDependences() {
        return [];
    }
}
