## About
**discord-command-bot** is a simple wrapper for creating command bot on your discord server.<br />
It is as simple as creating an array. You can even add interactive buttons(emojis).
## Instalation
Like every npm package: `npm install discord-command-bot` 
## Example usage
```js
import * as Discord from 'discord.js';
import {CommandBot, CommandsObject} from 'discord-command-bot';

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
                    commandContainer.menuMessage.edit("Page " + commandContainer.data.counter);
                },
                "▶": (commandContainer) => {
                    ++commandContainer.data.counter;
                    commandContainer.menuMessage.edit("Page " + commandContainer.data.counter);
                }
            },
        },
        onCall: (commandContainer) => {
            commandContainer.data.counter = 0;
        }
    }]), {
        prefix: '$'
    });
});

client.login('token');
```
## Links
* [GitHub](https://github.com/Ju5tMyWo4d/discord-command-bot)
