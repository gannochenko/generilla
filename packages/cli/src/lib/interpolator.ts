import { ObjectLiteral } from './type';

export class Interpolator {
    static apply(template: string, variables: ObjectLiteral) {
        for(const variable in variables) {
            const value = variables[variable].toString().replace(/[^a-zA-Z0-9_-]/g, '');

            template = template.replace(new RegExp(`\\[\\?${variable}\\]`, 'i'), '');
            template = template.replace(new RegExp(`\\[${variable}\\]`, 'g'), value);
        }

        return template;
    }
}
