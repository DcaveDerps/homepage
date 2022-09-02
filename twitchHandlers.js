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
    }
];

function initTwitchPane() {
    let twitchPane = document.getElementById("twitchLivePane");

    for (i=0;i<twitchChannels.length; i++) {
        let channel = twitchChannels[i];
        twitchPane.innerHTML = twitchPane.innerHTML +
        "<div class=\"twitchChannelBox\" id=\"twitchChannel" + i + "\">" +
        "<a href=https://www.twitch.tv/" + channel.login + " class=\"imageLink\"><img class=\"twitchIcon\" src=" + channel.profilePic + " >" + 
        "<img src=\"staticFiles\\checkingIcon.png\" class=liveIndicator id=twitchLiveStatus" + i + ">" +
        "</a>" +
        "</div>";
    }

}

async function getChannelLiveStatuses(token, clientID) {
    for(i=0; i<twitchChannels.length; i++) {
        let response = await fetch("https://api.twitch.tv/helix/streams?user_login=" + twitchChannels[i].login, {
            headers: {
                "Authorization": "Bearer " + token,
                "Client-Id": clientID
            },
            method: "GET"
        });

        if (response.ok) {
            responseJSON = await response.json();
            if ( typeof responseJSON.data[0] !== 'undefined') {
                document.getElementById("twitchLiveStatus" + i).src = "staticFiles\\liveIcon.png";
            }
            else {
                document.getElementById("twitchLiveStatus" + i).src = "staticFiles\\offlineIcon.png";
            }
        }
    }
}