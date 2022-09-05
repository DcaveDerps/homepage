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

async function initTwitchPane() {
    let twitchPane = document.getElementById("twitchLivePane");
    // liveChannels and offlineChannels will contain the indeces of the
    // twitch channels in the array twitchChannels based on their status
    let liveChannels = [];
    let offlineChannels = [];

    // init the channels
    for (i=0;i<twitchChannels.length; i++) {
        let channel = twitchChannels[i];
        twitchPane.innerHTML = twitchPane.innerHTML + buildChannelBoxHTML(channel.login, channel.profilePic, CHECKING_IMG_PATH);
    }

    let token = await getOAUTHToken();

    if (token !== undefined) {
        await getChannelLiveStatuses(token, getClientID(), liveChannels, offlineChannels);
        console.log("After call to getChannelLiveStatuses: liveChannels.length: " + liveChannels.length + " | offlineChannels.length: " + offlineChannels.length);
    }
    else {
        // Error retrieving data from Twitch, mark all channels as such
        console.log("Error receiving OAUTH token from Twitch");
        return;
    }

    // reset the innerHTML to be replaced with
    // the results from the Twitch request
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

// TODO:
// Sort the streams by live and offline and error, with the order being live->offline->error, with live being topmost, then offline, then error
// Might be possible to have the icons appear from off screen?

function buildChannelBoxHTML(login, profilePic, statusImage) {
    return "<div class=\"twitchChannelBox\" id=\"twitchChannel_" + login + "\">" +
    "<a href=https://www.twitch.tv/" + login + " class=\"imageLink\"><img class=\"twitchIcon\" src=" + profilePic + " >" + 
    "<img src=" + statusImage + " class=liveIndicator id=twitchLiveStatus_" + login + ">" +
    "</a>" +
    "</div>";
}

async function getChannelLiveStatuses(token, clientID, liveChannels, offlineChannels) {
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
        console.log("After loops in getChannelLiveStatuses: liveChannels.length: " + liveChannels.length + " | offlineChannels.length: " + offlineChannels.length);
    }
}

/*
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
*/

async function getOAUTHToken() {
    // check if the necesary js file exists
    if (typeof refreshOAUTH === "function") {
        let token = await refreshOAUTH();
        return token;
        //let clientID = await getClientID();
        //await getChannelLiveStatuses(token, clientID);

        //let broadcasterID = await getBroadcasterID("revscarecrow", token, clientID);
        //console.log("id is: " + broadcasterID);
    }
    else {
        console.log("necessary .js file missing");
        return undefined;
    }
}