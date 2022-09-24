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

    // test command
    //command = "/fill -20 2 5 50 4 5 minecraft:iron_block";

    console.log("original: " + command);

    let coordTuplePattern = new RegExp(/-?\d+\.?\d*\s-?\d+\.?\d*\s-?\d+\.?\d*/, 'g')
    let coordTuplePatternOnce = new RegExp(/-?\d+\.?\d*\s-?\d+\.?\d*\s-?\d+\.?\d*/);
    // find all of the coord tuples
    let tuples = command.matchAll(coordTuplePattern);
    command = command.replace(coordTuplePattern, "tup");

    console.log("found matches:");

    // convert the tuples to relative coords
    let curMatch = tuples.next();
    while (!curMatch.done) {
        console.log(curMatch.value);
        let relTuple = absTupleToRelCoords(curMatch.value[0]);
        console.log(relTuple);
        if (typeof(relTuple) === typeof(undefined)) {
            return;
        }
        else {
            console.log("before replace: " + command);
            command = command.replace("tup", relTuple);
            console.log("after replace: " + command);
        }
        curMatch = tuples.next();
    }

    console.log(command);

    appendOutput(command);

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