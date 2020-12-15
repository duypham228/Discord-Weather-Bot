const Discord = require("discord.js");
const bot = new Discord.Client();
const fetch = require("node-fetch");
const querystring = require("querystring");
const { prefix, token, apikey } = require("./config.json");

const convertUTTime = (ut) => {
  const dateObject = new Date(ut * 1000);
  const dateFormat = dateObject.toLocaleString(); //yyyy-dd-mm hh:mm
  return dateFormat;
};
//only for metrics from m/s to km/h
const covertWindSpeed = (speed) => {
  return Math.round(speed * 0.001 * 3600);
};
bot.on("ready", () => {
  console.log("Connected as " + bot.user.tag);
});

bot.login(token);

// parse command
bot.on("message", async (message) => {
  if (message.author.bot) return; // return if the sender is a bot
  if (!message.content.startsWith(prefix)) return; // return if the message is not a command

  const arguments = message.content.slice(prefix.length).trim().split(/ +/);
  const command = arguments.shift().toLowerCase();

  // arguments
  let loc1 = "";
  let loc2 = "";

  // let data = null;
  let data = null;
  let units = "metric";
  // console.log(arguments);
  switch (command) {
    // general data

    case "weather": // ?weather loc1
      loc1 = arguments.join(" ");
      // api call
      let getWeather = async () => {
        let query = querystring.stringify({
          q: loc1,
          appid: apikey,
          units: units,
        });
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?${query}`
        );
        const data = await response.json();
        return data;
      };
      //setup embeded message to discord channel
      let setUpMessage = async () => {
        data = await getWeather();
        const embed = new Discord.MessageEmbed()
          .setTitle(`Weather of ${loc1}`)
          .setThumbnail(
            `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          )
          .addFields(
            {
              name: `${
                data.weather[0].description.charAt(0).toUpperCase() +
                data.weather[0].description.slice(1)
              }`,
              value: `Updated: ${convertUTTime(data.dt)}`,
            },
            {
              name: `Degree Type`,
              value: `${units === "metric" ? "Celcius" : "Fahrenheit "}`,
              inline: true
            },
            {
              name: `Current`,
              value: `${Math.round(data.main.temp)}°`,
              inline: true
            },
            // {name: `Highest/Lowest`, value: `${Math.round(data.main.temp_max)}°/${Math.round(data.main.temp_min)}°`, inline: true},
            {
              name: "Feels like",
              value: `${Math.round(data.main.feels_like)}°`,
              inline: true
            },
            {
              name: "Humidity💧",
              value: `${data.main.humidity}%`,
              inline: true
            },
            {
              name: "Wind💨",
              value: `${
                units === "metric"
                  ? covertWindSpeed(data.wind.speed)
                  : data.wind.speed
              } ${units === "metric" ? "km/h" : "mph"}`,
              inline: true
            },
            {
                name: "Visibility\uD83D\uDC41",
                value: `${Math.round(data.visibility*0.001)} km`,
                inline: true
            }
          );

        message.channel.send(embed);
      };
      await setUpMessage();
      break;

    // single datum
    case "temp": // ?temp loc1
      loc1 = arguments.join(" ");
      // api call
      let getTemp = async () => {
        let query = querystring.stringify({
          q: loc1,
          appid: apikey,
          units: "metric",
        });
        // console.log(query);
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?${query}`
        ).then((response) => response.json());

        // let json = await response.json();
        return response;
      };
      // send back message to user and delete the command
      data = await getTemp();
      // message.delete();
      message.channel.send(
        `The temperature at ${loc1}, ${data.sys.country} is ${data.main.temp} Celcius`
      );
      break;

    case "humd": // ?humd loc1
      loc1 = arguments.join(" ");
      // api call

      // send back message to user and delete the command
      // message.delete();
      message.channel.send("The humidity at " + loc1 + " is ....");
      break;

    // help menu
    case "help": // list of available command
      break;
    case "forecast":
      break;

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
