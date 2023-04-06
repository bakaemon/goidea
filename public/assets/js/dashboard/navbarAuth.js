const checkAuthNav = () => {
    const token = getCookie('token');
   if (token) {
       return true;
    }
    return false;
}


const loadOptions = async () => {
    if (!checkAuthNav()) {
        //  generateGuestMenu();
        return;
    };
    const token = getCookie('token');
    const response = await fetch('/auth/api/verify_token?token=' + token);
    const data = await response.json();
    if (data.roles.includes('admin')) {
        generateAdminMenu();
    }
    else if (data.roles.includes('qam')) {
        generateQAMMenu();
    }
    else {
        generateGuestMenu();
    } 
    
}

const generateAdminMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <ul class="admin-menu">
            <div>
                <li>
                    <a href="/admin/departments" class="a">
                        <svg>
                            <use xlink:href="#collection"></use>
                        </svg>
                        <span>Departments</span>
                    </a>
                </li>
                <li>
                    <a href="/admin" class="a">
                        <svg>
                            <use xlink:href="#collection"></use>
                        </svg>
                        <span>Management</span>
                    </a>
                </li>
                <li>
                    <a href="/admin/users" class="a">
                        <svg>
                            <use xlink:href="#users"></use>
                        </svg>
                        <span>Users</span>
                    </a>
                </li>
                <li>
                    <a href="/ideas" class="a">
                        <svg>
                            <use xlink:href="#comments"></use>
                        </svg>
                        <span>Events Management</span>
                    </a>
                </li>
            </div>
        </ul>
    `;
    loginOptions.innerHTML = html;
}

const generateQAMMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <ul class="admin-menu">
                <li>
                    <a href="/category" class="a">
                        <svg>
                            <use xlink:href="#collection"></use>
                        </svg>
                        <span>Category</span>
                    </a>
                </li>
                <li>
                    <a href="/qam/download" class="a">
                        <svg>
                            <use xlink:href="#collection"></use>
                        </svg>
                        <span>Download Data</span>
                    </a>
                </li>
                <li>
                    <a href="/qam/dashboard/chart" class="a">
                        <svg>
                            <use xlink:href="#users"></use>
                        </svg>
                        <span>Dashboard</span>
                    </a>
                </li>
               
            </ul>
    `;
    loginOptions.innerHTML = html;
}

const generateGuestMenu = () => {
    const loginOptions = document.getElementById('loginOptions');
    const html = `
        <ul class="admin-menu">
                <li>
                    <a href="/login" class="a">
                        <svg>
                            <use xlink:href="#users"></use>
                        </svg>
                        <span>Login</span>
                    </a>
                </li>
            </ul>
    `;
    loginOptions.innerHTML = html;
}

window.addEventListener('load', loadOptions);