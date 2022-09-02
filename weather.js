// Weather.gov API

function formatForecast(forecastStr) {
    let lines = forecastStr.split(". ");
    let output = "";
    for (i=0; i<lines.length; i++) {
        output = output + lines[i];
        if (i+1 < lines.length) {
            output = output + ".<br>";
        }
    }
    return output;
}

async function getWeatherGovForecast() {
    let weatherGovData = await fetch("https://api.weather.gov/gridpoints/PBZ/78,66/forecast");

    if (weatherGovData.ok) {
        let response = await weatherGovData.json()
        let temp0 = response.properties.periods[0].temperature;
        let forecast0 = response.properties.periods[0].detailedForecast;
        console.log("Temp is " + temp0 + " degrees Fahrenheit");
        document.getElementById("weatherGovTemp").textContent = "Temp is " + temp0 + " degrees Fahrenheit.";
        document.getElementById("weatherGovForecast").innerHTML = formatForecast(forecast0);
        document.getElementById("forecastImg").src = response.properties.periods[0].icon;
    }
}

// Open Weather API

function initOpenMeteo() {
    
}

async function getOpenMeteoForecast() {
    let openMeteoData = await fetch("https://api.open-meteo.com/v1/forecast?latitude=40.44&longitude=-79.95&hourly=temperature_2m,apparent_temperature,rain,showers,snowfall,snow_depth&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&temperature_unit=fahrenheit&timeformat=unixtime&timezone=America%2FNew_York");

    if (openMeteoData.ok) {
        let openMetoResponse = await openMeteoData.json();
    }

}

async function getWeatherForecasts() {
    getWeatherGovForecast();
    getOpenMeteoForecast();
}