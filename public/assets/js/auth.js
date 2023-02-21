function verifyAuth() {
    var token = localStorage.getItem('access_token');
    alert(token);
    // check if token is valid
    if (token == null) {
        alert('You are not logged in. Redirecting to login page...');
        window.location.href = "/";
    }
    if (token) {
        fetch('/auth/api/isLoggedIn', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') }
        }).then(res => {
            if (!res.ok) {
                alert('You are not logged in. Redirecting to login page...');
                window.location.href = "/" ;
            }
        });
    }
}
