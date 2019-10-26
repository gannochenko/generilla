export interface ObjectLiteral<P = any> {
    [k: string]: P;
}

export interface GeneratorListItem {
    path: string;
    name: string;
    generator: Generator;
}

export interface TargetFsObject {
    type: 'f' | 'd';
    path: string;
}

export interface Generator {
    new (property: string): Generator;
    getName(): string;
    getQuestions(): Promise<any[]>;
    refineAnswers(answers: ObjectLiteral): Promise<ObjectLiteral>;
    getDependencies(): string[];
    getDevDependencies(): string[];
}

export type ObjectList = ObjectLiteral<TargetFsObject>;
