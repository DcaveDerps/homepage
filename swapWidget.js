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

function swapToCommands() {
    if(currentWidget != 1) {
        swapWidget("commandsPane", initCommandsPane);
        currentWidget = 1;
    }
}