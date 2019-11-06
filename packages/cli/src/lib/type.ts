export interface ObjectLiteral<P = any> {
    [k: string]: P;
}

export interface Command {
    name: string;
    args: ObjectLiteral;
}
