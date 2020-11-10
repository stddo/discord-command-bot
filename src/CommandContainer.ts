import {Message} from "discord.js";
import {Command} from "./CommandsObject";

export default class CommandContainer {
    /**
     * Command that was called
     */
    readonly command: Command;
    /**
     * Parameters that was passed after command (each word that is separated by " " is another parameter
     */
    readonly params: string[];
    /**
     * Store for data that will be preserved between commands calls
     */
    readonly data: { [name: string]: any } = {};
    /**
     * Reference to discord message object of message with command sent by user
     */
    readonly userMessage: Message;
    /**
     * Reference to discord message of message with menu sent by bot (if menu was specified for command)
     */
    readonly menuMessage: Message;

    constructor(command: Command, params: string[] | undefined, userMessage: Message, menuMessage?: Message) {
        this.command = command;
        this.params = params;
        this.userMessage = userMessage;
        this.menuMessage = menuMessage;
    }
}