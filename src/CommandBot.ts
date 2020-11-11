import * as Discord from 'discord.js'
import {default_config, default_help_command} from './default_config';
import CommandsObject from './CommandsObject';
import CommandContainer from './CommandContainer';

export type BotCommandsConfig = {
    /**
     * Prefix for commands used to call bot
     */
    prefix?: string,
    /**
     * If should add default command [prefix]help to commands list
     */
    useDefaultHelp?: boolean,
    /**
     * Message used by default noCommand function
     */
    noCommandMessage?: string,
    /**
     * Behaviour for commands that are not supported by bot
     */
    noCommand?: (this: CommandBot, channel: Discord.TextChannel) => void
};

/**
 * Class for creating new instance of bot (should be created after in discord client event "ready")
 */
export default class CommandBot {
    readonly client: Discord.Client;
    readonly commands: CommandsObject;
    readonly config: BotCommandsConfig;

    private readonly interactiveCommands: { [id: string]: CommandContainer } = {};

    /**
     * @param client Client instance from discord.js
     * @param commands CommandsObject with list of commands supported by bot
     * @param config Object with configurable parameters used by bot
     */
    constructor(client: Discord.Client, commands: CommandsObject, config: BotCommandsConfig = {}) {
        this.client = client;
        this.commands = commands;
        this.config = {...default_config, ...config};

        if(this.config.useDefaultHelp) {
            this.commands.add(default_help_command);
        }

        client.on("message", message => {
            if(client.user !== message.author && message.content.startsWith(this.config.prefix) && message.channel instanceof Discord.TextChannel) {
                this.parseCommand(message);
            }
        });

        client.on("messageReactionAdd", ((messageReaction, user) => {
            if(user === client.user) {
                return;
            }

            let commandContainer = this.interactiveCommands[messageReaction.message.id];
            if(commandContainer) {
                if(CommandBot.isPermittedToReact(commandContainer, user) && commandContainer.command.menu.elements[messageReaction.emoji.name]) {
                    commandContainer.command.menu.elements[messageReaction.emoji.name].call(this, commandContainer, user);
                }
                messageReaction.remove(user);
            }
        }));
    }

    private static isPermittedToReact(commandContainer: CommandContainer, author: Discord.User): boolean {
        return (commandContainer.command.menu.onlyAuthorInteraction && commandContainer.userMessage.author === author) || !commandContainer.command.menu.onlyAuthorInteraction;
    }

    private async parseCommand(message: Discord.Message) {
        let ar = message.content.slice(this.config.prefix.length).trim().split(" ");
        let command = ar[0];
        if(this.commands.get(command) && message.channel instanceof Discord.TextChannel) {
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