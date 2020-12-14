const Discord = require('discord.js');
const bot = new Discord.Client();
const {prefix, token} = require('./config.json');

bot.on('ready', () => {
    console.log("Connected as " + bot.user.tag);
})

bot.login(token);


// parse command
bot.on('message', message => {
    if (message.author.bot) return; // return if the sender is a bot
    if (!message.content.startsWith(prefix)) return; // return if the message is not a command

    const arguments = message.content.slice(prefix.length).trim().split(/ +/);
    const command = arguments.shift().toLowerCase();

    // arguments
    var loc1 = "";
    var loc2 = "";



    // console.log(arguments);
    switch (command) {
        // general data
        case "weather": // ?weather loc1
            loc1 = arguments[0];
            // api call

            // send back message to user and delete the command
            message.delete();
            message.channel.send("The weather at " + loc1 + " is ....");
            break;
        
        // single datum
        case "temp": // ?temp loc1
            loc1 = arguments[0];
            // api call

            // send back message to user and delete the command
            message.delete();
            message.channel.send("The temperature at " + loc1 + " is ....");
            break;
        
        case "humd": // ?humd loc1
            loc1 = arguments[0];
            // api call

            // send back message to user and delete the command
            message.delete();
            message.channel.send("The humidity at " + loc1 + " is ....");
            break;
        

        // help menu
        case "help": // list of available command
            

        // unknown command
        default: 
            message.channel.send("Unknown Command");
            break;
        
    }
});



// -weather loc1
// -forecast loc1
// -temp loc1
// bot.on('message', message => {
//     // console.log(message.content);
//     if (message.author.bot) return;
//     message.channel.send("Receive" + message.content);
// })