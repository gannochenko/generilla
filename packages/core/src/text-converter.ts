import caseFormatter from 'case-formatter';

export class TextConverter {
    public toKebab(value: string) {
        let result = caseFormatter.snakeToKebab(this.toSnake(value));
        if (typeof result === 'string') {
            result = result.replace(/^-+/, '');
        }

        return result;
    }

    public toPascal(value: string) {
        return caseFormatter.snakeToPascal(this.toSnake(value));
    }

    private toSnake(value: string) {
        return value.replace(/[-\s]+/g, '_');
    }
}
