var selectedid = null;
var departmentList;
var roleList;


async function loadTable() {
    var tableArea = document.getElementById('table-area');
    tableArea.innerHTML = "";
    var table = document.createElement('table');
    table.style.width = '100%';
    table.id = 'information';
    document.getElementById('table-area').appendChild(table);
    // fetch("https://raw.githubusercontent.com/fiduswriter/simple-datatables/main/docs/demos/18-fetch-api/demo.json")
    fetch('/accounts/api/all', { headers: { 'Authorization': 'Bearer ' + getCookie('token') } })
        .then(
            response => response.json()
        ).then(
            resData => {
                var data = resData.data;
                if (!data.length) {
                    return
                }
                var newHeaders = Object.keys(data[0]);
                // newHeaders[newHeaders.indexOf('_id')] = 'ID';
                newHeaders.shift();
                newHeaders = newHeaders.filter((item) => item != '__v' && item != 'updatedAt' && item != 'createdAt');
                newHeaders.push('Actions');
                var newRows = [];
                for (var row of data) {
                    var newRow = [];
                    for (var key in row) {
                        if (key == 'roles') {
                            newRow.push(row[key].join(', '));
                        }
                        else if (key == '__v' || key == 'updatedAt' || key == 'createdAt' || key == '_id') {
                            continue;
                        } else newRow.push(row[key]);
                    }
                    newRow.push(`
                        <a class="actionBtn modal-trigger"
                                                onclick="editUser(this, '${row._id}')" modal-param="${row._id}">Edit</a>
                        <button class="actionBtn" onclick="deleteAccount('${row._id}')">Delete</button>
                `);
                    newRows.push(newRow);
                }
                new simpleDatatables.DataTable(table, {
                    data: {
                        headings: newHeaders,
                        data: newRows
                    }
                })
            }
        )
}


var modalArea = document.getElementById('modal-area');

function editUser(e, id) {
    selectedid = id;
    var modalArea = document.querySelector('.modal-area');
    var modal = Modal(modalArea, {
        title: 'Edit User',
        get: {
            url: '/assets/html/user/editUser.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="updateAccounts()" class="updateBtn">Update</button>`,
    });
    modal.on('open', async (modal) => {
        var form = document.getElementById('editForm');
        setPlaceHolders(form, 'Loading...');
        disableForm(form);
        var res = await fetch("/accounts/api/get?id=" + selectedid);
        if (!res.ok) {
            alert((await res.json()).message);
            setPlaceHolders(form, 'No data found');
            return;
        }
        var data = await res.json();
        document.getElementById('username').value = data.username;
        document.getElementById('email').value = data.email;
        document.getElementById('DateOfBirth').value = data.birthday.split('T')[0];
        var roleCheckboxes = document.getElementsByName('role');
        for (var i = 0; i < roleCheckboxes.length; i++) {
            if (data.roles.includes(roleCheckboxes[i].value)) {
                
                roleCheckboxes[i].checked = true;
            }
        }

        await populateData();
        departmentList.forEach(department => {
                var option = document.createElement('option');
                option.value = department._id;
                option.innerHTML = department.name;
                document.getElementById('department').appendChild(option);
            });
        enableForm(form);
        setPlaceHolders(form, '');
    });
    modal.on('close', (modal) => {
        selectedid = null;
    });

    modal.open();
}

function createUser(e) {
    var modal = Modal('.modal-area', {
        title: 'Create User',
        get: {
            url: '/assets/html/user/createUser.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="createAccounts()" class="createBtn">Create</button>`,
    });
    modal.on('open', async (modal) => {
        await populateData();
        for(var d of departmentList) {
            var option = document.createElement('option');
            option.value = d._id;
            option.innerHTML = d.name;
            document.getElementById('departments').appendChild(option);
        }
    });

    
    modal.open();
}

function userInforForm(e) {
    var modal = Modal('.modal-area', {
        title: 'User Information',
        get: {
            url: '/assets/html/user/userInfo.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="#" class="createBtn">Change Password</button>`,
    });
    modal.open();
}

// check if form inputs has been filled, if not then disable input until data are loaded
function disableForm(form) {
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value == "" && inputs[i].id != "DateOfBirth") {
            inputs[i].disabled = true;
        }
    }
}

// enable form inputs
function enableForm(form) {
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== "") {
            inputs[i].disabled = false;
        }
    }
}

// set all form text field placeholder as loading
function setPlaceHolders(form, text) {
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].placeholder = text;
    }
}

async function updateAccounts() {
    var id = selectedid;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var dateofbirth = document.getElementById("DateOfBirth").value;
    var roleCheckboxes = document.getElementsByName('role');
    var roles = [];
    for (var i = 0; i < roleCheckboxes.length; i++) {
        if (roleCheckboxes[i].checked) {
            roles.push(roleCheckboxes[i].value);
        }
    }

    if (username == "" || email == "" || dateofbirth == "") {
        alert("Please fill all the fields");
        return;
    }
    var data = {
        _id: id,
        username: username,
        email: email,
        birthday: dateofbirth,
        roles: roles,
        displayName: username

    };
    try {
        var response = await fetch('/accounts/api/' + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(data)

        });
        var data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = "/admin/users";
            console.log(data);
            return;
        }
        else {
            alert(data.message);
            return;
        }
    } catch (error) {
        alert(error);
    }
    return false;
}


async function deleteAccount(id) {
    var x = confirm("Are you sure you want to delete this account?");
    if (x) {
        try {
            var res = await fetch('/accounts/api/admin_remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('token')
                },
                body: JSON.stringify({
                    accountId: id
                })
            });
            var data = await res.json();
            if (data.success) {
                alert(data.message);
                loadTable();
            }
            else {
                alert(data.message);
            }
        }
        catch (err) {
            alert(err);
        }
    }
    else
        return false;
}


// create new user script
async function createAccounts() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var dateofbirth = document.getElementById("dob").value;
    var dob = new Date(dateofbirth);
    var roleCheckboxes = document.getElementsByName("role");
    var roles = [];
    for (var i = 0; i < roleCheckboxes.length; i++) {
        if (roleCheckboxes[i].checked) {
            roles.push(roleCheckboxes[i].value);
        }
    }

    if (username == "" || email == "" || password == "" || confirmPassword == "" ) {
        alert("Please fill all the fields");
        return;
    }
    var data = {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        birthday: dob,
        roles: roles,

    };
    try {
        var response = await fetch('/auth/api/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        });
        var data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = "/admin/users";
            return;
        }
        else {
            alert(data.message);
            return;
        }
    } catch (error) {
        alert(error);
    }
    return false;
}

async function populateData() {
    if (!departmentList) {
        departmentList = [];
        var data = await fetch('/department/api/all');
        var departments = (await data.json()).data;
        for (var d of departments) {
            departmentList.push(d);
        }
        return departmentList;
    }
    
}

window.onload = async (e) => {
    loadTable();
}