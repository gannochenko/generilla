import { ObjectLiteral } from './type';

export class Interpolator {
    static apply(template: string, variables: ObjectLiteral) {
        let processedTemplate = template;
        // eslint-disable-next-line no-restricted-syntax
        for (const variable in variables) {
            if (Object.prototype.hasOwnProperty.call(variables, variable)) {
                const value = variables[variable]
                    .toString()
                    .replace(/[^a-zA-Z0-9_-]/g, '');

                processedTemplate = template.replace(
                    new RegExp(`\\[\\?${variable}\\]`, 'i'),
                    '',
                );
                processedTemplate = template.replace(
                    new RegExp(`\\[${variable}\\]`, 'g'),
                    value,
                );
            }
        }

        return processedTemplate;
    }
}
