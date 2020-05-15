import * as Discord from "discord.js"
import {default_config, default_help_command} from "./default_config";
import CommandsObject from "./CommandsObject";
import CommandContainer from "./CommandContainer";

export type BotCommandsConfig = {
    prefix?: string,
    defaultHelp?: boolean,
    noCommandMessage?: string,
    noCommand?: (this: CommandBot, channel: Discord.TextChannel) => void
};

export default class CommandBot {
    readonly client: Discord.Client;
    readonly commands: CommandsObject;
    readonly config: BotCommandsConfig;

    private readonly interactiveCommands: {[id: string]: CommandContainer} = {};

    constructor(client: Discord.Client, commands: CommandsObject, config: BotCommandsConfig = {}) {
        this.client = client;
        this.commands = commands;
        this.config = {...default_config, ...config};

        if(this.config.defaultHelp) {
            this.commands.add(default_help_command);
        }

        client.on("message", message => {
            if(message.content.startsWith(this.config.prefix) && (message.channel instanceof Discord.TextChannel || message.channel instanceof Discord.DMChannel)) {
                this.parseCommand(message);
            }
        });

        client.on("messageReactionAdd", ((messageReaction, user) => {
            if(user === client.user) {
                return;
            }

            let cmd = this.interactiveCommands[messageReaction.message.id];
            if(cmd && ((cmd.command.menu.onlyAuthorInteraction && cmd.userMessage.author === user) || !cmd.command.menu.onlyAuthorInteraction)) {
                if(cmd.command.menu.elements[messageReaction.emoji.name]) {
                    cmd.command.menu.elements[messageReaction.emoji.name].call(this, cmd, user);
                }
            }
            messageReaction.remove(user);
        }));
    }

    private async parseCommand(message: Discord.Message) {
        let ar = message.content.slice(this.config.prefix.length).trim().split(" ");
        let command = ar[0];
        if(this.commands.get(command) && (message.channel instanceof Discord.TextChannel || message.channel instanceof Discord.DMChannel)) {
            let commandContainer: CommandContainer;
            if(this.commands.get(command).menu) {
                let msg = <Discord.Message>await message.channel.send(this.commands.get(command).menu.messageText);
                commandContainer = new CommandContainer(this.commands.get(command), ar.slice(1), message, msg);
                this.interactiveCommands[msg.id] = commandContainer;

                for(const emoji in this.commands.get(command).menu.elements) {
                    try {
                        await msg.react(emoji);
                    } catch(e) {
                        try {
                            await msg.react(msg.guild.emojis.find(e => e.name === emoji));
                        } catch(e) {
                            console.error(e);
                        }
                    }
                }
            } else {
                commandContainer = new CommandContainer(this.commands.get(command), ar.slice(1), message);
            }

            this.commands.get(command).onCall.call(this, commandContainer, ...ar.slice(1));
        } else {
            this.config.noCommand.call(this, message.channel);
        }
    }
}