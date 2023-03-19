const checkAuth = () => {
    const token = getCookie('token');
    if (token) {
        return true;
    }
    return false;
}

const loadOptions = async () => {
    if (!checkAuth()) {
        generateGuestMenu();
        return;
    };
    const token = getCookie('token');
    const response = await fetch('auth/api/verify_token?token=' + token);
    const data = await response.json();
    if (data.roles.includes('admin')) {
        generateAdminMenu();
    }
    else if (data.roles.includes('qam')) {
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
        <li role="presentation"><a role="menuitem" tabindex="-3" href="#">Inbox</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-4" href="logout()">Log Out</a></li>
    `;
    loginOptions.innerHTML = html;
}

const generateUserMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">My Profile</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-2" href="#">Inbox</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-3" href="logout()">Log Out</a></li>
    `;
    loginOptions.innerHTML = html;
}

const generateQAMMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">My Profile</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-2" href="#">Dashboard</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-3" href="logout()">Log Out</a></li>
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

window.addEventListener('load', loadOptions);