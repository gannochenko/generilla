import { Inquirer } from 'inquirer';
import { TextConverter } from './text-converter';
import { Template } from './template';

export interface ObjectLiteral<P = any> {
    [k: string]: P;
}

export interface GeneratorListItem {
    path: string;
    name: string;
    code: string;
    generator: Generator;
}

export interface TargetFsObject {
    type: 'f' | 'd';
    path: string;
}

export interface Generator {
    new (property: string): Generator;
    setContext(context: ObjectLiteral): string;
    getName(): string;
    onBeforeExecution(): boolean;
    getQuestions(): Promise<any[]>;
    refineAnswers(answers: ObjectLiteral): Promise<ObjectLiteral>;
    getDependencies(answers: ObjectLiteral): Dependencies;
    getDevDependencies(answers: ObjectLiteral): Dependencies;
    onAfterExecution(answers: ObjectLiteral): void;
}

export type ObjectList = ObjectLiteral<TargetFsObject>;

export interface Dependencies {
    destination?: string;
    packages: string[];
}

export interface GeneratorUtils {
    inquirer: Inquirer;
    textConverter: TextConverter;
    execa: any;
    makeTemplate: (templateFolder: string) => Template;
    ejs: any;
}

export interface GeneratorClass {
    new (util: GeneratorUtils): Generator;
}

export interface GeneratorImport {
    default?: GeneratorClass;
    Generator?: GeneratorClass;
}

export interface Command {
    name: string;
    args: ObjectLiteral;
}
