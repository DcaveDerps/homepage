currentWidget = -1;

function swapWidget(rootTagLabel, widgetInitFunction) {
    document.getElementById("swappableWidget").innerHTML = "<div id=\"" + rootTagLabel + "\"></div>";
    widgetInitFunction();
}

function swapToWeather() {
    if(currentWidget != 0) {
        swapWidget("weatherPane", initWeatherPane);
        currentWidget = 0;
    }
}