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
    let command = document.getElementById("commandInputBox").textContent;

    // test command
    command = "/fill -20 2 5 50 4 5 minecraft:iron_block";

    let coordTuplePattern = new RegExp(/-?\d+\.?\d*\s-?\d+\.?\d*\s-?\d+\.?\d*/, 'g')

    // find all of the coord tuples
    let tuples = command.matchAll(coordTuplePattern);

    console.log("found matches:");

    // convert the tuples to relative coords
    let curMatch = tuples.next();
    while (!curMatch.done) {
        console.log(curMatch.value);
        console.log(absTupleToRelCoords(curMatch.value[0]));
        if (typeof(absTupleToRelCoords(curMatch.value[0])) === typeof(undefined)) {
            return;
        }
        curMatch = tuples.next();
    }

}

function absTupleToRelCoords(tupleString) {
    let blockX = Number(document.getElementById("xCoord").value);
    let blockY = Number(document.getElementById("yCoord").value);
    let blockZ = Number(document.getElementById("zCoord").value);

    // ADD ERROR CHECKING
    if (isNaN(blockX) || isNaN(blockY) || isNaN(blockZ)) {
        return undefined;
    }

    let coords = tupleString.split(" ");
    for (let i = 0; i < coords.length; i++) {
        coords[i] = Number(coords[i]);
    }
    console.log(coords);

    return "~" + (coords[0] - blockX) + " ~" + (coords[1] - blockY) + " ~" + (coords[2] - blockZ);

}