var tokenListener = {
    valueInternal: null,
    valueListener: function (val) {},
    set value(val) {
        this.valueInternal = val;
        this.valueListener(val);
    },
    get value() {
        return this.valueInternal;
    },
}
var refreshAccessToken = async function () {
    if (!getCookie('refresh_token')) {
        return;
    }
    const authRes = await fetch('/auth/api/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh_token: getCookie('refresh_token')
        })
    });
    if (!authRes.ok) {
        console.log('Error refreshing access token');
        return;
    }
    const auth = await authRes.json();
    if (auth.access_token) {
        tokenListener.value = auth.access_token;
        console.log("Token refreshed");
    }
}
window.onload = function () {
    refreshAccessToken();
}


window.onunload = function () {
    refreshAccessToken();
}

setInterval(refreshAccessToken, 1000 * 30);