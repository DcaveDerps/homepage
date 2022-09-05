// Weather.gov API
const TEMP_UNIT = " °F";

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

function initWeatherGov() {
    let weatherPaneHTML = document.getElementById("weatherPane");

    weatherPaneHTML.innerHTML = weatherPaneHTML.innerHTML + "<div id=\"weatherGov\" class=\"forecastPanel\">" +
    "<img id=\"forecastImg\" alt=\"forecast thumbnail\">" +
    "<br>" +
    "<div id=\"weatherGovTemp\"></div>" +
    "<br>" +
    "<div id=\"weatherGovForecast\"></div>" +
    "</div>";
}

async function getWeatherGovForecast() {
    let weatherGovData = await fetch("https://api.weather.gov/gridpoints/PBZ/78,66/forecast");

    if (weatherGovData.ok) {
        let response = await weatherGovData.json()
        let temp0 = response.properties.periods[0].temperature;
        let forecast0 = response.properties.periods[0].detailedForecast;
        console.log("Temp is " + temp0 + " degrees Fahrenheit");
        document.getElementById("weatherGovTemp").textContent = "Temp is " + temp0 + TEMP_UNIT;
        document.getElementById("weatherGovForecast").innerHTML = formatForecast(forecast0);
        document.getElementById("forecastImg").src = response.properties.periods[0].icon;
    }
}

// Open Weather API

function initOpenMeteo() {
    let weatherPaneHTML = document.getElementById("weatherPane");

    weatherPaneHTML.innerHTML = weatherPaneHTML.innerHTML + "<div id=\"openMeteo\" class=\"forecastPanel\"></div>";

}

async function getOpenMeteoForecast() {
    let openMeteoData = await fetch("https://api.open-meteo.com/v1/forecast?latitude=40.44&longitude=-79.95&hourly=temperature_2m,apparent_temperature,rain,showers,snowfall,snow_depth&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York");

    let hour = new Date().getHours();

    if (openMeteoData.ok) {
        let openMeteoResponse = await openMeteoData.json();
        let openMeteoPane = document.getElementById("openMeteo");

        let hourlyData = openMeteoResponse.hourly;
        let dailyData = openMeteoResponse.daily;

        openMeteoPane.innerHTML = openMeteoPane.innerHTML + "OpenMeteo Report<br>";

        // may be a way to optimize this later
        if (hourlyData.temperature_2m[hour] !== undefined) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Temperature: " + hourlyData.temperature_2m[hour] + TEMP_UNIT + "</div>";
        }
        if (hourlyData.apparent_temperature[hour] !== undefined) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Feels like: " + hourlyData.apparent_temperature[hour] + TEMP_UNIT + "</div>";
        }
        if (dailyData.temperature_2m_max[0] !== undefined) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div> High: " + dailyData.temperature_2m_max[0] + TEMP_UNIT + "</div>";
        }
        if (dailyData.temperature_2m_min[0] !== undefined) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div> Low: " + dailyData.temperature_2m_min[0] + TEMP_UNIT + "</div>";
        }
        if (hourlyData.rain[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Rainfall: " + hourlyData.rain[hour] + " inches</div>";
        }
        if (hourlyData.snowfall[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Snowfall: " + hourlyData.snowfall[hour] + " cm</div>";
        }
        if (hourlyData.snow_depth[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Snowfall: " + hourlyData.snow_depth[hour] + " m</div>";
        }
        if (hourlyData.showers[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Showers: " + hourlyData.showers[hour] + " inches</div>";
        }

        openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Sunrise: " + new Date(dailyData.sunrise[0]).toLocaleTimeString() + "</div>" +
        "<div>Sunset: " + new Date(dailyData.sunset[0]).toLocaleTimeString() + "</div>";

    }
    else {
        openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div><strong>Error retrieving data.</strong></div>";
    }

}

function initWeatherPane() {
    initWeatherGov();
    initOpenMeteo();

    getWeatherForecasts();
}

async function getWeatherForecasts() {
    getWeatherGovForecast();
    getOpenMeteoForecast();
}