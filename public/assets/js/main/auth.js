
var account;

const checkAuth = () => {
    const token = getCookie('token');
    if (token) {
        return true;
    }
    return false;
}

const verifyToken = async () => {
    const token = getCookie('token');
    const response = await fetch('/auth/api/verify_token?token=' + token);
    account = await response.json();
}

const loadOptions = async () => {
    if (!checkAuth()) {
        generateGuestMenu();
        return;
    };
    if (account.roles.includes('admin')) {
        generateAdminMenu();
    }
    else if (account.roles.includes('qam')) {
        generateQAMMenu();
    }
    else {
        generateUserMenu();
    } 
}

const generateAdminMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">My Profile</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-2" href="/admin">Dashboard</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-4" href="javascript:logout()">Log Out</a></li>
    `;
    loginOptions.innerHTML = html;
}

const generateUserMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">My Profile</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-2" href="#">Inbox</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-3" href="javascript:logout()">Log Out</a></li>
    `;
    loginOptions.innerHTML = html;
}

const generateQAMMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">My Profile</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-2" href="/qam/dashboard/abc">Dashboard</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-3" href="javascript:logout()">Log Out</a></li>
    `;
    loginOptions.innerHTML = html;
}

const generateGuestMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <li role="presentation"><a role="menuitem" tabindex="-1" href="/login">Log In</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-2" href="#">Sign Up</a></li>
    `;
    loginOptions.innerHTML = html;
}

const generateExtraOptions = async () => {
    if (!checkAuth()) {
        return;
    }
    const extraOptions = document.getElementById('extra-option');
    var res = await fetch('/auth/api/verify_token?token=' + getCookie('token'))
    if(!res.ok) {
        return;
    }
    var data = await res.json();
    if (data.roles.includes('staff')) {
        const html = `<a href="/home/ideas/upload"><button class="btn btn-primary">Start New Topic</button></a>`;
        extraOptions.innerHTML = html;
    }
}

window.addEventListener('load', async () => {
    if (checkAuth()) {
        await verifyToken();
    }
   await loadOptions();
   await generateExtraOptions();
});

const logout = () => {
    fetch('/auth/api/logout').then(() => {
        setCookie('token', '', 0);
        setCookie('refresh_token', '', 0);
        window.location.href = '/home';
    });
}