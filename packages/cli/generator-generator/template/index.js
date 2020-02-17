module.exports.Generator = class Generator {
    getName() {
        return 'New generator <%- generator_name %>';
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
