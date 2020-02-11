import { Command as CommanderCommand } from 'commander';

export interface CommandAction {
    code: string;
    arguments?: {
        generator: string;
        answers: any;
        yes: any;
        output: any;
    };
}

export type ActionCallback = (action: CommandAction) => void;

interface CommandProcessorInstance {}

export interface CommandProcessor {
    new (): CommandProcessorInstance;
    attach(program: CommanderCommand, actionCallback: ActionCallback): void;
    process(): void;
}

export function Implements<T>() {
    return <U extends T>(constructor: U) => {
        constructor;
    };
}
