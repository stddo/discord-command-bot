import {BotCommandsConfig} from "./CommandBot";
import {Command} from "./CommandsObject";

let default_config: BotCommandsConfig = {
    prefix: "!",
    defaultHelp: true,
    noCommandMessage: "Command not found, type !help for list of commands.",
    noCommand: function (channel) { channel.send(this.config.noCommandMessage);}
};

let default_help_command: Command = {
    name: "help",
    description: "Shows this help or commands list.\n\nUsage:\n!help [command]",
    short: "help about commands",
    onCall: function (commandContainer, command: string) {
        if(command) {
            commandContainer.userMessage.channel.send(this.commands.get(command).description);
        } else {
            let s = "HELP\n";
            for(let cm in this.commands.commands) {
                if(this.commands.commands.hasOwnProperty(cm)) {
                    s += `**${cm}** *${this.commands.commands[cm].short}*\n`;
                }
            }
            commandContainer.userMessage.channel.send(s);
        }
    }
};

export {default_config, default_help_command};