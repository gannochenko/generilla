export class Generator {
    public getName() {
        return 'Cool README template';
    }

    getQuestions() {
        return [
            {
                code: 'component_name',
                text: 'What is the component name?',
            },
        ];
    }
}
