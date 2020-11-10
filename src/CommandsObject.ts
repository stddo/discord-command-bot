import CommandBot from "./CommandBot";
import CommandContainer from "./CommandContainer";
import {User} from "discord.js";

export type Command = {
    /**
     * Unique name of the command used to call from chat by [prefix][name]
     */
    name: string,
    /**
     * Description of the command
     */
    description: string,
    /**
     * Short description of the command
     */
    short: string,
    /**
     * Behaviour that will be perform after command is called
     * @param commandContainer
     * @param params Command parameters the same as in CommandContainer
     */
    onCall: (this: CommandBot, commandContainer: CommandContainer, ...params: any[]) => void
    /**
     * Data for menu that will be displayed as a message with emojis to interact with
     */
    menu?: {
        /**
         * Init message that will be showed after command call and before any interaction
         */
        messageText: string,
        /**
         * Object with menu elements (key - emoji that will be displayed, value - function that will be called after interact with emoji), they will appear in order they were specified
         */
        elements: { [emoji: string]: (this: CommandBot, commandContainer: CommandContainer, reactionUser: User) => any },
        /**
         * Flag that will prevent other users than user who sent command from triggering functions assigned to emojis
         */
        onlyAuthorInteraction?: boolean,
    }
};

/**
 * Object with list of supported commands that has to be passed to CommandBot
 */
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