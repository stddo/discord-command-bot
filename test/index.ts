import * as Discord from "discord.js";
import {CommandBot, CommandsObject} from "../";

const client = new Discord.Client();

client.on('ready', () => {
    new CommandBot(client, new CommandsObject([{
        name: "pages",
        description: "Long description of command.",
        short: "short dsc",
        menu: {
            messageText: "Page 0",
            elements: {
                "◀": (commandContainer) => {
                    --commandContainer.data.counter;
                    commandContainer.message.edit("Page " + commandContainer.data.counter);
                },
                "▶": (commandContainer) => {
                    ++commandContainer.data.counter;
                    commandContainer.message.edit("Page " + commandContainer.data.counter);
                }
            },
        },
        onCall: (commandContainer) => {
            commandContainer.data.counter = 0;
        }
    }]));
});

client.login(/*your_bot_token*/);