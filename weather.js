// Weather.gov API
const TEMP_UNIT = " °F"

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
        document.getElementById("weatherGovTemp").textContent = "Temp is " + temp0 + TEMP_UNIT;
        document.getElementById("weatherGovForecast").innerHTML = formatForecast(forecast0);
        document.getElementById("forecastImg").src = response.properties.periods[0].icon;
    }
}

// Open Weather API

function initOpenMeteo() {
    let weatherPaneHTML = document.getElementById("weatherPane");

    weatherPaneHTML.innerHTML = weatherPaneHTML.innerHTML + "<div id=\"openMeteo\">OpenMeteo Report<br></div>";

}

async function getOpenMeteoForecast() {
    let openMeteoData = await fetch("https://api.open-meteo.com/v1/forecast?latitude=40.44&longitude=-79.95&hourly=temperature_2m,apparent_temperature,rain,showers,snowfall,snow_depth&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York");

    let hour = new Date().getHours();

    if (openMeteoData.ok) {
        let openMeteoResponse = await openMeteoData.json();
        let openMeteoPane = document.getElementById("openMeteo");

        let hourlyData = openMeteoResponse.hourly;
        let dailyData = openMeteoResponse.daily;

        openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Temperature: " + hourlyData.temperature_2m[0] + TEMP_UNIT + "</div>" +
        "<div>Feels like: " + hourlyData.apparent_temperature[hour] + TEMP_UNIT + "</div>" + 
        "<div> High: " + dailyData.temperature_2m_max[0] + TEMP_UNIT + "</div>" +
        "<div> Low: " + dailyData.temperature_2m_min[0] + TEMP_UNIT + "</div>";

        if (hourlyData.rain[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoData.innerHTML + "<div>Rainfall: " + hourlyData.rain[hour] + " inches</div>";
        }
        if (hourlyData.snowfall[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoData.innerHTML + "<div>Snowfall: " + hourlyData.snowfall[hour] + " cm</div>";
        }
        if (hourlyData.snow_depth[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoData.innerHTML + "<div>Snowfall: " + hourlyData.snow_depth[hour] + " m</div>";
        }
        if (hourlyData.showers[hour] > 0) {
            openMeteoPane.innerHTML = openMeteoData.innerHTML + "<div>Showers: " + hourlyData.showers[hour] + " inches</div>";
        }

        openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div>Sunrise: " + new Date(dailyData.sunrise[0]).toLocaleTimeString() + "</div>" +
        "<div>Sunset: " + new Date(dailyData.sunset[0]).toLocaleTimeString() + "</div>";

    }
    else {
        openMeteoPane.innerHTML = openMeteoPane.innerHTML + "<div><strong>Error retrieving data.</strong></div>";
    }

}

function initWeatherPane() {
    initOpenMeteo();
}

async function getWeatherForecasts() {
    getWeatherGovForecast();
    getOpenMeteoForecast();
}