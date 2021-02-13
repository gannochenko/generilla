import { ObjectLiteral } from './type';

export class Interpolator {
    static apply(template: string, variables: ObjectLiteral) {
        let processedTemplate = template;
        // eslint-disable-next-line no-restricted-syntax
        for (const variable in variables) {
            if (Object.prototype.hasOwnProperty.call(variables, variable)) {
                let value = variables[variable];
                if (value === undefined) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        `No value for the placeholder for "${variable}", setting to ''`,
                    );
                    value = '';
                } else {
                    value = value.toString().replace(/[^a-zA-Z0-9._-]/g, '');
                }

                processedTemplate = processedTemplate.replace(
                    new RegExp(`\\[\\?${variable}\\]`, 'i'),
                    '',
                );
                processedTemplate = processedTemplate.replace(
                    new RegExp(`\\[${variable}\\]`, 'g'),
                    value,
                );
            }
        }

        return processedTemplate;
    }
}
