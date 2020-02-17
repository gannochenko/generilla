module.exports.Generator = class Generator {
    getName() {
        return 'Generator generator';
    }

    getQuestions() {
        return [
            {
                message: 'What is the generator name?',
                name: 'generator_name',
            },
        ];
    }
};
