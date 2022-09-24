const LIVE_IMG_PATH = "staticFiles\\liveIcon.png";
const OFFLINE_IMG_PATH = "staticFiles\\offlineIcon.png";
const CHECKING_IMG_PATH = "staticFiles\\checkingIcon.png";

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
        login: "hackerling",
        profilePic: "staticFiles\\hackerlingChannelProfile.png"
    },
    {
        broadcasterId: 79698024,
        login: "jabroni_mike",
        profilePic: "staticFiles\\jabroni_mikeChannelProfile.png"
    },
    {
        login: "limealicious",
        profilePic: "staticFiles\\limealiciousChannelProfile.png"
    },
    {
        login: "revscarecrow",
        profilePic: "staticFiles\\revscarecrowChannelProfile.png"
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
    }
];

function buildChannelBoxHTML(login, profilePic, statusImage) {
    return "<div class=\"twitchChannelBox\" id=\"twitchChannel_" + login + "\">" +
    "<a href=https://www.twitch.tv/" + login + " class=\"imageLink\"><img class=\"twitchIcon\" src=" + profilePic + " >" + 
    "<img src=" + statusImage + " class=liveIndicator id=twitchLiveStatus_" + login + ">" +
    "</a>" +
    "</div>";
}

async function refreshChannelLiveStatuses() {
    let twitchPane = document.getElementById("twitchLivePane");
    // liveChannels and offlineChannels will contain the indeces of the
    // twitch channels in the array twitchChannels based on their status
    let liveChannels = [];
    let offlineChannels = [];

    let token = await getOAUTHToken();

    // if protectedScripts.js doesn't exist, don't try to update
    if (token === undefined) { return; }

    // getChannelLiveStatuses handles if token is expired
    await getChannelLiveStatuses(token, getClientID(), liveChannels, offlineChannels);

    // reset the innerHTML to be replaced with
    // the results from the Twitch API request
    twitchPane.innerHTML = "";

    for (i=0;i<liveChannels.length; i++) {
        let channel = twitchChannels[liveChannels[i]];
        twitchPane.innerHTML = twitchPane.innerHTML + buildChannelBoxHTML(channel.login, channel.profilePic, LIVE_IMG_PATH);
    }

    for (i=0; i < offlineChannels.length; i++) {
        let channel = twitchChannels[offlineChannels[i]];
        twitchPane.innerHTML = twitchPane.innerHTML + buildChannelBoxHTML(channel.login, channel.profilePic, OFFLINE_IMG_PATH);
    }

}

async function initTwitchPane() {
    let twitchPane = document.getElementById("twitchLivePane");

    twitchPane.innerHTML = "";

    // init the channel boxes so there's no pop-in upon the Twitch API response
    for (i=0;i<twitchChannels.length; i++) {
        let channel = twitchChannels[i];
        twitchPane.innerHTML = twitchPane.innerHTML + buildChannelBoxHTML(channel.login, channel.profilePic, CHECKING_IMG_PATH);
    }
    // check if OAUTH token is initialized in local storage
    let token = await getOAUTHToken();

    if (token !== undefined) {
        await refreshChannelLiveStatuses();
    }
}

async function getChannelLiveStatuses(token, clientID, liveChannels, offlineChannels, noRetry) {
    let requestURL = "https://api.twitch.tv/helix/streams?";

    for (i = 0; i < twitchChannels.length; i++) {
        requestURL = requestURL + "user_login=" + twitchChannels[i].login;
        if (i + 1 !== twitchChannels.length) {
            requestURL = requestURL + "&";
        }
    }

    let response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + token,
                "Client-Id": clientID
            },
            method: "GET"
        });
    
    if (response.ok) {
        responseJSON = await response.json();

        // check each result in the data array
        // if response.data is empty, no one is online, and they're already marked as such

        // if response.data is not empty, check each result and mark each channel live accordingly

        // streams are returned sorted by viewcount, can't rely on consistent order
        for (i = 0; i < twitchChannels.length; i++){
            let live = false;
            for (j = 0; j < responseJSON.data.length; j++) {
                if (responseJSON.data[j].user_login === twitchChannels[i].login) {
                    liveChannels[liveChannels.length] = i;
                    live = true;
                    break;
                }
            }
            if (!live) {
                offlineChannels[offlineChannels.length] = i;
            }
        }
    }
    else if (noRetry !== true) {
        console.log("Error: " + response.statusText);
        console.log("Resetting OAUTH and trying again...");
        // update OAUTH token and try again
        token = await getOAUTHToken(true);
        await getChannelLiveStatuses(token, clientID, liveChannels, offlineChannels, true);
    }
}

async function getOAUTHToken(forceReset) {
    // check if the necesary js file exists
    if (typeof resetTwitchOAUTH === "function") {
        if (forceReset || localStorage["OAUTHToken"] === undefined) {
            let token = await resetTwitchOAUTH();
            localStorage["OAUTHToken"] = token;
            return token;
        }
        else {
            return localStorage["OAUTHToken"];
        }
        //let clientID = await getClientID();
        //await getChannelLiveStatuses(token, clientID);

        //let broadcasterID = await getBroadcasterID("revscarecrow", token, clientID);
        //console.log("id is: " + broadcasterID);
    }
    else {
        console.log("necessary protectedScripts.js file is missing");
        return undefined;
    }
}