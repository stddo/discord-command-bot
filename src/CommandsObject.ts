import CommandBot from "./CommandBot";
import CommandContainer from "./CommandContainer";
import {User} from "discord.js";

export type Command = {
    name: string,
    description: string,
    short: string,
    onCall: (this: CommandBot, commandContainer: CommandContainer, ...params: any[]) => void
    menu?: {
        messageText: string,
        elements: {[emoji: string]: (this: CommandBot, commandContainer: CommandContainer, reactionUser: User) => any},
        onlyAuthorInteraction?: boolean,
    }
};

export default class CommandsObject implements Iterable<Command> {
    readonly commands: {[name: string]: Command};

    constructor(commands: Command[]) {
        this.commands = {};
        this.add(commands);
    }

    add(commands: Command[] | Command) {
        if(commands instanceof Array){
            for(let command of commands) {
                this.commands[command.name] = command;
            }
        } else {
            this.commands[commands.name] = commands;
        }
    }

    get(command: string): Command {
        return this.commands[command];
    }

    *[Symbol.iterator](): Iterator<Command> {
        for(const commandName in this.commands) {
            yield this.commands[commandName];
        }
    }
}