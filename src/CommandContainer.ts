import {DMChannel, Message, TextChannel, User} from "discord.js";
import { Command } from "./CommandsObject";

export default class CommandContainer {
    readonly command: Command;
    readonly params: string[];
    readonly author: User;
    readonly channel: TextChannel | DMChannel;
    readonly data: {[name: string]: any} = {};
    readonly message: Message;

    constructor(command: Command, params: string[] | undefined, channel: TextChannel | DMChannel, author: User, message?: Message) {
        this.command = command;
        this.params = params;
        this.author = author;
        this.channel = channel;
        this.message = message;
    }
}