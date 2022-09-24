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
    "<div id=\"commandOutputBox\" class=\"centeredVertical\"></div>" +
    "</div>";
}

function absToRelCoords(){
    let command = document.getElementById("commandInputBox").value;

    let coordTuplePattern = new RegExp(/-?\d+\.?\d*\s-?\d+\.?\d*\s-?\d+\.?\d*/, 'g')
    // find all of the coord tuples
    let tuples = command.matchAll(coordTuplePattern);

    let curMatch = tuples.next();
    if (curMatch.done) { return; }

    command = command.replace(coordTuplePattern, "tup");

    // convert the tuples to relative coords
    while (!curMatch.done) {

        let relTuple = absTupleToRelCoords(curMatch.value[0]);

        if (relTuple === undefined) {
            return;
        }
        else {
            command = command.replace("tup", relTuple);
        }
        curMatch = tuples.next();
    }

    appendOutput(command);

}

function absTupleToRelCoords(tupleString) {
    let blockX = document.getElementById("xCoord").value;
    let blockY = document.getElementById("yCoord").value;
    let blockZ = document.getElementById("zCoord").value;

    // ADD ERROR NOTIFICATION
    if ((isNaN(blockX) || blockX === "") || (isNaN(blockY) || blockY === "") || (isNaN(blockZ) || blockZ === "")) {
        return undefined;
    }

    let coords = tupleString.split(" ");
    for (let i = 0; i < coords.length; i++) {
        coords[i] = Number(coords[i]);
    }

    return "~" + (coords[0] - Number(blockX)) + " ~" + (coords[1] - Number(blockY)) + " ~" + (coords[2] - Number(blockZ));

}

function appendOutput(command) {
    document.getElementById("commandOutputBox").innerHTML += "<div class=\"horizontalList\">" +
    "<div class=\"commandOutput\">" + command + "</div>" +
    "<button onclick=\"copyCommandToClipboard(this)\">Copy</button>"
    "</div>";
}

function copyCommandToClipboard(button) {
    let parent = button.parentElement;
    let text = parent.querySelector(".commandOutput").textContent;

    navigator.clipboard.writeText(text);
}