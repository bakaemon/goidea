var selectedid = null;

// async function loadTable() {
//     var table = new DataTable('#information');
//     var res = await fetch('/accounts/api/all', {headers: {'Authorization': 'Bearer ' + getCookie('token')}});
//     if (!res.ok) {
//         var resData = await res.json();
//         console.log(resData);
//         alert(resData.message);
//         return;
//     }
//     var jsonData = (await res.json()).data;
//     var tableData = [];
//     for (var row of jsonData)
//     {
//         row.actions = `
//         <button class="actionBtn fa fa-pencil-square-o"
//                                 onclick="editUser('${row._id}')">Edit</button>
//         <button class="actionBtn fa fa-trash-o" onclick="deleteAccount('${row._id}')">Delete</button>
//         `;
//         tableData.push(row);
//     }
//     console.log(tableData);
//     table.insert(tableData);
// }

// const { async } = require("rxjs");

// async function loadTable() {
//     var table = new simpleDatatables.DataTable('#information');
//     var res = await fetch('/accounts/api/all', { headers: { 'Authorization': 'Bearer ' + getCookie('token') } });
//     var jsonData = await (await res.json()).data;
//     var newData = [];
//     for (var row of jsonData) {
//         var roles = row.roles;
//         delete row.roles;
//         delete row.__v;
//         var newRow = {
//             ...row,
//             roles: roles.join(', '),
//             actions: `
//         <button class="actionBtn fa fa-pencil-square-o"
//                                 onclick="editUser('${row._id}')">Edit</button>
//         <button class="actionBtn fa fa-trash-o" onclick="deleteAccount('${row._id}')">Delete</button>
//         `,

//         };
//         newData.push(newRow);
//     }
//     console.log(newData);
//     table.insert(newData);
// }
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
                newHeaders[newHeaders.indexOf('_id')] = 'ID';
                newHeaders = newHeaders.filter((item) => item != '__v' && item != 'updatedAt' && item != 'createdAt');
                newHeaders.push('Actions');
                var newRows = [];
                for (var row of data) {
                    var newRow = [];
                    for (var key in row) {
                        if (key == 'roles') {
                            newRow.push(row[key].join(', '));
                        }
                        else if (key == '__v' || key == 'updatedAt' || key == 'createdAt') {
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
                console.log(newRows);
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

// function closeModal(e) {
//     e.style.display = "none";
//     selectedid = null;
// }

// async function editUser(id) {
//     selectedid = id;
//     modalArea.innerHTML = `<div id="id01" class="modal">
//         <form class="modal-content animate" id="editForm">
//         <div class="imgcontainer">
//             <span onclick="closeModal(document.getElementById('id01'))" class="close"
//                 title="Close">&times;</span>
//         </div>
//         <div class="container">
//             <label for="name"><b>Name</b></label>
//             <input type="text" placeholder="User Name" id="username" name="name" required>
//             <label for="email"><b>Email</b></label>
//             <input type="email" placeholder="abc@email.com" name="email" id="email" required>
//             <label for="DateOfBirth"><b>Date of Birth</b></label>
//             <input type="date" id="DateOfBirth" name="DateOfBirth" required>
//             <div style="width:200">
//                 <label for="department"><b>Department</b></label>
//                 <br>
//                 <select name="departments" class="selectedItem" id="departments" required>
//                 </select>
//             </div>
//             <div style="width:200">
//                 <label for="roles"><b>Roles</b></label>
//                 <br>
//                 <select name="roles" class="selectedItem" id="roles" required>
//                 </select>
//             </div>
//         </div>
//         <div class="container" style="background-color:#f1f1f1">
//             <button type="button" onclick="updateAccounts()" class="updateBtn">Update</button>
//         </div>
//     </form>
//     </div>`;
//     var modal = document.getElementById('id01');
//     var res = await fetch("/accounts/api/get?id=" + id);
//     if (!res.ok) {
//         alert((await res.json()).message);
//         return;
//     }
//     var data = await res.json();
//     console.log(data);
//     document.getElementById('username').value = data.username;
//     document.getElementById('email').value = data.email;
//     document.getElementById('DateOfBirth').value = data.DateOfBirth;
//     document.getElementById('roles').value = data.roles;
//     var departmentSelect = document.getElementById('departments');
//     departmentSelect.innerHTML = "";
//     for (var i = 0; i < data.department.length; i++) {
//         var option = document.createElement('option');
//         option.value = data.department[i].name;
//         option.innerHTML = data.department[i].name;
//         departmentSelect.appendChild(option);
//     }
//     var rolesSelect = document.getElementById('roles');
//     rolesSelect.innerHTML = "";
//     for (var i = 0; i < data.roles.length; i++) {
//         var option = document.createElement('option');
//         option.value = data.roles[i].name;
//         option.innerHTML = data.roles[i].name;
//         rolesSelect.appendChild(option);
//         window.onclick = function (event) {
//             if (event.target == modal) {
//                 closeModal(modal)
//             }
//         }

//     }
//     modal.style.display = 'block';
// }


function editUser(e, id) {
    selectedid = id;
    var modalArea = document.querySelector('.modal-area');
    var modal = Modal(modalArea, {
        title: 'Edit User',
        get: {
            url: '/assets/html/editUser.html',
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
            url: '/assets/html/createUser.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="createAccounts()" class="updateBtn">Create</button>`,
    });
    modal.open();
}

// check if form inputs has been filled, if not then disable input until data are loaded
function disableForm(form) {
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value == "") {
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
    var roles = document.getElementById("roles").value;

    if (username == "" || email == "" || dateofbirth == "") {
        alert("Please fill all the fields");
        return;
    }
    var data = {
        _id: id,
        username: username,
        email: email,
        DateOfBirth: dateofbirth,
        roles: roles,

    };
    try {
        var response = await fetch('/accounts/api/:id', {
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
async function submit() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var dateofbirth = document.getElementById("DateOfBirth").value;
    var roles = document.getElementById("roles").value;

    if (username == "" || email == "" || password == "" || confirmPassword == "" || dateofbirth == "") {
        alert("Please fill all the fields");
        return;
    }
    var data = {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        DateOfBirth: dateofbirth,
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




window.onload = async (e) => {
    loadTable();
}