# Discord Weather Bot

<!-- TABLE OF CONTENTS -->
## Table of Contents
<details open="open">
  <summary>Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![product-screenshot]

We build this Weather Discord Bot to help you be able to know the weather around the world with just few simple commands. The bot reply the report to you in the group message, so you and your friends can dicuss where to hang out easier. There is another bot available for weather, but the command prefix they use is @ which is for mentioning. Therefore, that bot is not working properly for many users, so we create this bot to fix that bug and provide even more interesting commands.

Here's why:
* Easy to Use: No setup required. It only takes one command to get weather report
* Lag Free: We ensure that there is always enough capacity for every server to get the highest quality possible
* Stable: Noob Tech Bot will always be available whenever you need to know the weather outside
* Credible: We always retrieves data from most trustworthy weather data collectors

### Built With

* [Discord.js](https://discord.js.org/#/)
* [Chart.js](https://www.chartjs.org/)
* [Surge](https://surge.sh/)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites
A Discord server that you are adminstrator to be able to grant permission for bot.

### Installation
#### For Deverlopers:
1. Get a free API Key at [OpenWeatherMap](https://openweathermap.org/api) and [Aqicn](https://aqicn.org/api/)
2. Clone the repo
   ```sh
   git clone https://github.com/duypham228/Discord-Weather-Bot
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Change loading variable from env to config.js, env variables are for heroku hosting.
5. Enter your API in `config.js`
   ```JS
   const API_KEY = 'ENTER YOUR API';
   ```
#### For Users:
1. Follow the [link](http://weatherbot.surge.sh/) to the bot website
2. Invite the bot to your server
3. Grant the bot permission
4. Use the bot with commands


<!-- USAGE EXAMPLES -->
## Usage

1. Weather Command:

![weather-screenshot]

2. Forecast Command:

![forecast-screenshot]

3. Air Quality Command:

![air-screenshot]


_For more examples, please refer to the [Commands Page](http://weatherbot.surge.sh/cmds.html)_




<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Long Huynh - peterlonghaihuynh25@gmail.com

Duy Pham - duyphamm228@gmail.com

Duc Dao - ducdao121598@gmail.com

An Phan - phanthanhan2107@gmail.com
Project Link: [https://github.com/duypham228/Discord-Weather-Bot](https://github.com/duypham228/Discord-Weather-Bot)





<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: readme-img/website.png
[weather-screenshot]: readme-img/weather.png
[forecast-screenshot]: readme-img/forecast.png
[air-screenshot]: readme-img/air.png
