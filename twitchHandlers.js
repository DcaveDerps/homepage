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
        broadcaster_id: 79698024,
        element_id: "twitchLiveStatus0"
    },
    {
        broadcaster_id: 28219022,
        element_id: "twitchLiveStatus1"
    },
    {
        broadcaster_id: 25725272,
        element_id: "twitchLiveStatus2"
    }
];

async function getChannelLiveStatuses(token, clientID) {
    for(i=0; i<twitchChannels.length; i++) {
        let response = await fetch("https://api.twitch.tv/helix/streams?user_id=" + twitchChannels[i].broadcaster_id, {
            headers: {
                "Authorization": "Bearer " + token,
                "Client-Id": clientID
            },
            method: "GET"
        });

        if (response.ok) {
            responseJSON = await response.json();
            if ( typeof responseJSON.data[0] !== 'undefined') {
                document.getElementById(twitchChannels[i].element_id).innerHTML = "<strong>channel is live!</strong>";
            }
            else {
                document.getElementById(twitchChannels[i].element_id).innerHTML = "channel is offline.";
            }
        }
    }
}