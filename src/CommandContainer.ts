import {Message} from "discord.js";
import { Command } from "./CommandsObject";

export default class CommandContainer {
    readonly command: Command;
    readonly params: string[];
    readonly data: {[name: string]: any} = {};
    readonly userMessage: Message;
    readonly menuMessage: Message;

    constructor(command: Command, params: string[] | undefined, userMessage: Message, menuMessage?: Message) {
        this.command = command;
        this.params = params;
        this.userMessage = userMessage;
        this.menuMessage = menuMessage;
    }
}