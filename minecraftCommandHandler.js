function initCommandsPane() {
    document.getElementById("commandsPane").innerHTML = "<div class=\"centeredVertical\">" + 
    "<textarea class=\"commandUIBox\" cols=\"100\" rows=\"1\" id=\"commandInputBox\" size=\"100px\" placeholder=\"Paste commands here\nOne command per operation.\"></textarea>" +
    "<strong>Command Block Coords:</strong>" +
    "<div id=\"coordsBox\">" + 
    "<textarea class=\"commandUIBox\" rows=\"1\" cols=\"7\" id=\"xCoord\" placeholder=\"X coord\"></textarea>" +
    "<textarea class=\"commandUIBox\" rows=\"1\" cols=\"7\" id=\"yCoord\" placeholder=\"Y coord\"></textarea>" +
    "<textarea class=\"commandUIBox\" rows=\"1\" cols=\"7\" id=\"zCoord\" placeholder=\"Z coord\"></textarea>" +
    "</div>" +
    "<button id=\"commandSubmitButton\" onclick=\"absToRelCoords()\">Convert</button>" +
    "<div id=\"commandOutputBox\"></div>" +
    "</div>";
}

function absToRelCoords(){
    let command = document.getElementById("commandInputBox");

}