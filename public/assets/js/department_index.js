
var selectedid = null;
var modalArea = document.getElementById('modal-area');

async function loadTableDepartment() {
    var tableArea = document.getElementById('table-area');
    tableArea.innerHTML = "";
    var table = document.createElement('table');
    table.style.width = '100%';
    table.id = 'information';
    document.getElementById('table-area').appendChild(table);
    // fetch("https://raw.githubusercontent.com/fiduswriter/simple-datatables/main/docs/demos/18-fetch-api/demo.json")
    fetch('/department/api/all', { headers: { 'Authorization': 'Bearer ' + getCookie('token') } })
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
                                                onclick="editDepartmentForm(this, '${row._id}')" modal-param="${row._id}">Edit</a>
                        <button class="actionBtn" onclick="deleteDepartment('${row._id}')">Delete</button>
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

async function createDepartmentForm(e) {
    var modal = Modal('.modal-area', {
        title: 'Create New Department',
        get: {
            url: '/assets/html/department/createDepartment.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="createDepartments()" class="createBtn">Create</button>`,
    });
    modal.open();
}

function editDepartmentForm(e, id) {
    selectedid = id;
    var modal = Modal('.modal-area', {
        title: 'Edit Department',
        get: {
            url: '/assets/html/department/editDepartment.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="editDepartments()" class="editBtn">Edit</button>`,
    });
    modal.on('open', async (modal) => {
        var form = document.getElementById('editDpForm');
        setPlaceHolders(form, 'Loading...');
        disableForm(form);
        var res = await fetch("/department/api/get?id=" + selectedid);
        if (!res.ok) {
            alert((await res.json()).message);
            setPlaceHolders(form, 'No data found');
            return;
        }
        var data = await res.json();
        document.getElementById('name').value = data.name;
        document.getElementById('description').value = data.description;
        enableForm(form);
        setPlaceHolders(form, '');
    });
    modal.on('close', (modal) => {
        selectedid = null;
    });
    modal.open();
}


// unfinished
async function deleteDepartment(id) {
    var x = confirm("Are you sure you want to delete this department?");
    if (x) {
        try {
            var res = await fetch('/department/api/:id/delete', {
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

async function editDepartments() {
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var data = {
        id: selectedid,
        name: name,
        description: description,
    };
    try {
        var response = await fetch('/department/api/:id/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(data),
        });
        var data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = "/admin/departments";
            return;
        }
        else {
            alert(data.message);
            return;
        }
    }
    catch (error) {
        alert(error);
    }
}

async function createDepartments() {
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var data = {
        name: name,
        description: description,
    };
    try {
        var response = await fetch('/department/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(data),
        });
        var data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = "/admin/departments";
            return;
        }
        else {
            alert(data.message);
            return;
        }
    }
    catch (error) {
        alert(error);
    }
}

window.onload = async (e) => {
    loadTableDepartment();
}