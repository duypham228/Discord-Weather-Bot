const Discord = require('discord.js');
const bot = new Discord.Client();
const {prefix, token} = require('./config.json');

bot.on('ready', () => {
    console.log("Connected as " + bot.user.tag);
})

bot.login('Nzg2NTQ1MTQwMjgwOTgzNTUz.X9H9Pg.IuXHuiJ-rA76UFDRCCQVvJMecJo');