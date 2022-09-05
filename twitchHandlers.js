async function getBroadcasterID(loginName, token, clientID) {
    let requestURL = "https://api.twitch.tv/helix/users?login=" + loginName;
    let response = await fetch(requestURL, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "Client-Id": clientID
        }
    });
    let result = -1;

    if (response.ok) {
        responseJSON = await response.json();
        result = responseJSON.data[0].id;
    }

    return result;
}

twitchChannels = [
    {
        broadcasterId: 79698024,
        login: "jabroni_mike",
        profilePic: "staticFiles\\jabroni_mikeChannelProfile.png"
    },
    {
        broadcasterId: 28219022,
        login: "vargskelethor",
        profilePic: "staticFiles\\vargskelethorChannelProfile.png"
    },
    {
        broadcasterId: 25725272,
        login: "vinesauce",
        profilePic: "staticFiles\\vinesauceChannelProfile.png"
    },
    {
        login: "limealicious",
        profilePic: "staticFiles\\limealiciousChannelProfile.png"
    },
    {
        login: "hackerling",
        profilePic: "staticFiles\\hackerlingChannelProfile.png"
    },
    {
        login: "revscarecrow",
        profilePic: "staticFiles\\revscarecrowChannelProfile.png"
    }
];

function initTwitchPane() {
    let twitchPane = document.getElementById("twitchLivePane");
    let liveChannels = [];
    let offlineChannels = [];

    for (i=0;i<twitchChannels.length; i++) {
        let channel = twitchChannels[i];
        twitchPane.innerHTML = twitchPane.innerHTML + buildChannelBoxHTML(channel.login, channel.profilePic);
    }

}

// TODO:
// Sort the streams by live and offline and error, with the order being live->offline->error, with live being topmost, then offline, then error
// Might be possible to have the icons appear from off screen?

function buildChannelBoxHTML(login, profilePic) {
    return "<div class=\"twitchChannelBox\" id=\"twitchChannel_" + login + "\">" +
    "<a href=https://www.twitch.tv/" + login + " class=\"imageLink\"><img class=\"twitchIcon\" src=" + profilePic + " >" + 
    "<img src=\"staticFiles\\checkingIcon.png\" class=liveIndicator id=twitchLiveStatus_" + login + ">" +
    "</a>" +
    "</div>";
}

async function getChannelLiveStatuses(token, clientID) {
    let requestURL = "https://api.twitch.tv/helix/streams?";

    for (i = 0; i < twitchChannels.length; i++) {
        requestURL = requestURL + "user_login=" + twitchChannels[i].login;
        if (i + 1 !== twitchChannels.length) {
            requestURL = requestURL + "&";
        }
    }

    //console.log(requestURL);

    let response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + token,
                "Client-Id": clientID
            },
            method: "GET"
        });
    
    if (response.ok) {
        responseJSON = await response.json();

        // assume all are offline
        for (i = 0; i < twitchChannels.length; i++) {
                document.getElementById("twitchLiveStatus_" + twitchChannels[i].login).src = "staticFiles\\offlineIcon.png";
        }


        // check each result in the data array
        // if response.data is empty, no one is online, and they're already marked as such

        // if response.data is not empty, check each result and mark each channel live accordingly

        // streams are returned sorted by viewcount, can't rely on consistent order
        for (i = 0; i < responseJSON.data.length; i++){
            for (j = 0; j < twitchChannels.length; j++) {
                if (responseJSON.data[i].user_login === twitchChannels[j].login) {
                    document.getElementById("twitchLiveStatus_" + twitchChannels[j].login).src = "staticFiles\\liveIcon.png";
                    break;
                }
            }
        }


    }
}

async function getOAUTHToken() {
    // check if the necesary js file exists
    if (typeof refreshOAUTH === "function") {
        let token = await refreshOAUTH();
        let clientID = await getClientID();
        await getChannelLiveStatuses(token, clientID);

        //let broadcasterID = await getBroadcasterID("revscarecrow", token, clientID);
        //console.log("id is: " + broadcasterID);
    }
    else {
        console.log("necessary .js file missing");
    }
}