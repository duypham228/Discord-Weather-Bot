//used to attach image of the forecast chart to bot's message
const { MessageAttachment } = require("discord.js");
const Discord = require("discord.js");
const bot = new Discord.Client();
const { CanvasRenderService } = require("chartjs-node-canvas");

const fetch = require("node-fetch");
const querystring = require("querystring");
// const { prefix, token, apikey, airkey } = require("./config.json");
const prefix = process.env.prefix;
const token = process.env.token;
const apikey = process.env.apikey;
const airkey = process.env.airkey;

//chart's width and height
const width = 800;
const height = 400;
const convertUTTime = (ut) => {
    const dateObject = new Date(ut * 1000);
    const dateFormat = dateObject.toLocaleString(); //yyyy-dd-mm hh:mm
    return dateFormat;
};
//only for metrics from m/s to km/h
const covertWindSpeed = (speed) => {
    return Math.round(speed * 0.001 * 3600);
};
//setup the chart
const chartCallBack = (ChartJS) => {
    ChartJS.plugins.register({
        beforeDraw: (chartInstance) => {
            const { chart } = chartInstance;
            const { ctx } = chartInstance.chart;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chart.width, chart.height);
        },
    });
};
//load a plugin to show values of data points
const chartJSFactory = () => {
    const Chart = require("chart.js");
    require("chartjs-plugin-datalabels");
    delete require.cache[require.resolve("chart.js")];
    delete require.cache[require.resolve("chartjs-plugin-datalabels")];
    return Chart;
};
bot.on("ready", () => {
    console.log("Connected as " + bot.user.tag);
});

bot.login(token);

// parse command
bot.on("message", async(message) => {
    if (message.author.bot) return; // return if the sender is a bot
    if (!message.content.startsWith(prefix)) return; // return if the message is not a command

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    console.log();
    // default arguments
    let loc1 = "";
    let loc2 = "";

    // let data = null;
    let data = null;
    let units = "imperial";


    // handle flags
    const regexp = /(-[lu]\s+[a-z0-9\s]+)/g;
    const str = message.content.toLowerCase();
    let flags;
    if (str.match(regexp) != null)
        flags = [...str.match(regexp)];
    else
        flags = str.match(regexp);

    if (flags == null){ // there is no flags
        loc1 = args.join(" ");
    } else { // there are flags
        var i = 0;
        for (i = 0; i < flags.length; i++){ // iterating to process each flag
            let currentFlag = flags[i].trim();
            let flagName = currentFlag.substr(0, currentFlag.indexOf(' '));
            let flagArg = currentFlag.substr(currentFlag.indexOf(' ')+1);
            if (flagName == "-l") {
                loc1 = flagArg;
            } else if (flagName == "-u"){
                units = flagArg;
            }
        }
    }
    
    // console.log(arguments);
    switch (command) {
        // general data

        case "weather": // ?weather loc1
            
            // api call
            // this api call requires a specific location, units of measurement, and api key
            let getWeather = async() => {
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
            let setUpMessage = async() => {
                data = await getWeather();
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Weather of ${loc1}`)
                    .setDescription(`**Current Temperature: ${Math.round(data.main.temp)}°**`)
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
                        inline: true,
                    }, 
                    {
                        name: `Highest/Lowest`,
                        value: `${Math.round(data.main.temp_max)}°/${Math.round(
                            data.main.temp_min
                        )}°`,
                        inline: true,
                    }, 
                    {
                        name: "Feels like",
                        value: `${Math.round(data.main.feels_like)}°`,
                        inline: true,
                    }, 
                    {
                        name: "Humidity💧",
                        value: `${data.main.humidity}%`,
                        inline: true,
                    }, 
                    {
                        name: "Wind💨",
                        value: `${
                            units === "metric"
                            ? covertWindSpeed(data.wind.speed)
                            : data.wind.speed
                            } ${units === "metric" ? "km/h" : "mph"}`,
                        inline: true,
                    }, 
                    {
                        name: "Visibility\uD83D\uDC41",
                        value: `${Math.round(data.visibility * 0.001)} km`,
                        inline: true,
                    });

                message.channel.send(embed);
            };
            await setUpMessage();
            break;
            // help menu
        case "help": // list of available command
            break;
        case "forecast":
            //this function executes two api calls in order to get data of a location given
            //by user.
            let getForecast = async() => {
                let query = querystring.stringify({
                    q: loc1,
                    appid: apikey,
                    units: units,
                });
                //call this api to obtain latitude and longitude of the given location
                const res1 = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?${query}`
                );
                const data1 = await res1.json();
                const { lat, lon } = data1.coord;
                query = querystring.stringify({
                    lat: lat,
                    lon: lon,
                    exclude: "hourly,current,minutely",
                    appid: apikey,
                    units: units,
                });
                //call this api to get weather forecast in 7 days of the given location
                const res2 = await fetch(
                    `https://api.openweathermap.org/data/2.5/onecall?${query}`
                );
                const data2 = await res2.json();
                return data2;
            };
            let setUpChart = async() => {
                data = await getForecast();
                //NOTED: the predicted values of temperatures and humidities are subject to change.
                //Therefore, you could have completely two different graphs for the same location as time 
                //changes.

                //the first y-axis used to represent average temperature
                //average temperature is computed as (highest+lowest)/2
                const temps = [];
                //the second y-axis used to represent humidity
                const hums = [];
                //dates are put into x-axis of the graph
                const dates = [];
                //extract desired data from the JSON returned by the second api call
                for (const item of data.daily) {
                    dates.push(convertUTTime(item.dt).slice(0, 5));
                    temps.push(Math.round(item.temp.max + item.temp.min) / 2);
                    hums.push(item.humidity);
                }
                const canvas = new CanvasRenderService(
                    width,
                    height,
                    chartCallBack,
                    undefined,
                    chartJSFactory
                );
                //setup the graph
                const config = {
                    type: "line",
                    data: {
                        //x-axis
                        labels: dates,
                        datasets: [
                            //first datasets (i.e: sets of y values)
                            {
                                label: `Average Temperature °${units === "metric" ? "C" : "F"}`,
                                yAxisID: "Temp",
                                data: temps,
                                backgroundColor: "red",
                                borderColor: "#ffcccb",
                                fill: false,
                                datalabels: {
                                    align: "start",
                                    anchor: "start",
                                },
                                order: 1,
                            },
                            {
                                label: "Humidity %",
                                yAxisID: "Humidity",
                                data: hums,
                                backgroundColor: "blue",
                                borderColor: "#7289d9",
                                fill: false,
                                datalabels: {
                                    align: "end",
                                    anchor: "end",
                                },
                                order: 2,
                            },
                        ],
                    },
                    options: {
                        plugins: {
                            datalables: {
                                backgroundColor: (context) => {
                                    return context.dataset.backgroundColor;
                                },
                                borderRadius: 4,
                                color: "red",
                                font: {
                                    weight: "bold",
                                },
                            },
                        },
                        title: {
                            display: true,
                            text: `Weather Forecast of ${loc1} in 7 Days`,
                        },
                        //configure two y-axes
                        //please read chartjs documentation for more details
                        scales: {
                            yAxes: [{
                                    id: "Temp",
                                    type: "linear",
                                    position: "left",
                                    ticks: {
                                        callback: (value) => value + "°",
                                    },
                                    offset: true,
                                },
                                {
                                    id: "Humidity",
                                    type: "linear",
                                    position: "right",
                                    ticks: {
                                        callback: (value) => value + "%",
                                    },
                                    offset: true,
                                },
                            ],
                        },
                    },
                };

                const image = await canvas.renderToBuffer(config);
                const attachment = new MessageAttachment(image);
                message.channel.send(attachment);
            };
            await setUpChart();
            break;
        

        case "air-quality":
            //this function executes two api calls in order to get data of a location given
            //by user.
            let getAir = async() => {
                let query = querystring.stringify({
                    token: airkey,
                    keyword: loc1
                });
                //call this api to obtain latitude and longitude of the given location
                const res1 = await fetch(
                    `https://api.waqi.info/search/?${query}`
                );
                const data1 = await res1.json();
                return data1;
            };
            let setUpAirMess = async() => {
                data = await getAir();
                // console.log(data);
                let condition = "";
                let score = data.data[0].aqi;
                if (score >= 0 && score <= 50) condition = "Good";
                else if (score > 50 && score <= 100) condition = "Moderate";
                else if (score > 100 && score <= 150) condition = "Unhealthy for sensitive groups";
                else if (score > 150 && score <= 200) condition = "Unhealthy";
                else if (score > 200 && score <= 300) condition = "Very Unhealthy";
                else if (score > 300) condition = "Hazardous";


                
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Air Quality of ${loc1}`)
                    .addFields(
                    {
                        name: "Station Name",
                        value: data.data[0].station.name,
                    },
                    {
                        name: "Condition",
                        value: `${condition}`,
                        inline: true,
                    }, 
                    {
                        name: "Air Quality Index",
                        value: `${Math.round(score)}`,
                        inline: true,
                    }
                    );
                
                if (condition == "Good"){
                    embed
                        .attachFiles(['./air-face/good.png'])
                        .setThumbnail('attachment://good.png');
                } else if (condition == "Moderate"){
                    embed
                        .attachFiles(['./air-face/moderate.png'])
                        .setThumbnail('attachment://moderate.png');
                } else if (condition == "Unhealthy for sensitive groups"){
                    embed
                        .attachFiles(['./air-face/unhealthy-sensitive.png'])
                        .setThumbnail('attachment://unhealthy-sensitive.png');
                } else if (condition == "Unhealthy"){
                    embed
                        .attachFiles(['./air-face/unhealthy.png'])
                        .setThumbnail('attachment://unhealthy.png');
                } else if (condition == "Very Unhealthy"){
                    embed
                        .attachFiles(['./air-face/vunhealthy.png'])
                        .setThumbnail('attachment://vunhealthy.png');
                } else {
                    embed
                        .attachFiles(['./air-face/hazardous.png'])
                        .setThumbnail('attachment://hazardous.png');
                }
                

                message.channel.send(embed);
            };
            await setUpAirMess();
            break;

            // unknown command
        default:
            message.channel.send("Unknown Command");
            break;
    }
});