import { Command as CommanderCommand } from 'commander';
import { ObjectLiteral } from '../type';
import { Generilla } from '../lib/generilla';

export type CommandActionArguments = ObjectLiteral;

export interface CommandAction {
    command: CommandProcessor;
    arguments: CommandActionArguments;
}

export type ActionCallback = (action: CommandAction) => void;

interface CommandProcessorInstance {}

export interface CommandProcessor {
    new (): CommandProcessorInstance;
    attach(program: CommanderCommand, actionCallback: ActionCallback): void;
    process(generilla: Generilla, args?: CommandActionArguments): Promise<void>;
}

export function Implements<T>() {
    return <U extends T>(constructor: U) => {
        constructor;
    };
}
