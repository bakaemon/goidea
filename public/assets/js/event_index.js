var selectedid = null;
var departmentList;
var categoryList;
var modalArea = document.getElementById('modal-area');

async function loadEventTable() {
    var tableArea = document.getElementById('table-area-event');
    tableArea.innerHTML = "";
    var table = document.createElement('table');
    table.style.width = '100%';
    table.id = 'information';
    document.getElementById('table-area-event').appendChild(table);
    // fetch("https://raw.githubusercontent.com/fiduswriter/simple-datatables/main/docs/demos/18-fetch-api/demo.json")
    fetch('/event/api/all', { headers: { 'Authorization': 'Bearer ' + getCookie('token') } })
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
                newHeaders.shift();
                newHeaders = newHeaders.filter((item) => item != '__v' && item != 'updatedAt' && item != 'createdAt');
                newHeaders.push('Actions');
                var newRows = [];
                for (var row of data) {
                    var newRow = [];
                    for (var key in row) {
                        if (key == 'department' || key == 'category') {
                            newRow.push(row[key].name);
                        }
                        else if (key=="author") newRow.push(row[key].username);
                        else if (key == '__v' || key == 'updatedAt' || key == 'createdAt' || key == '_id') {
                            continue;
                        } else newRow.push(row[key]);
                    }
                    newRow.push(`
                        <a class="actionBtn modal-trigger"
                                                onclick="editEventForm(this, '${row._id}')" modal-param="${row._id}">Edit</a>
                        <button class="actionBtn" onclick="deleteEvent('${row._id}')">Delete</button>
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

async function createEventForm(e) {
    var modal = Modal('.modal-area', {
        title: 'Create New Event',
        get: {
            url: '/assets/html/Events/createEvents.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="createEvents()" class="createBtn">Create</button>`,
    });
    modal.on('open', async (modal) => {
        await populateDepartmentData();
        for(var d of departmentList) {
            var option = document.createElement('option');
            option.value = d._id;
            option.innerHTML = d.name;
            document.getElementById('department').appendChild(option);
        }
        await populateCategoryData();
        for (var c of categoryList) {
            var option = document.createElement('option');
            option.value = c._id;
            option.innerHTML = c.name;
            document.getElementById('category').appendChild(option);
        }
    });
    modal.open();
}

async function editEventForm(e, id) {
    selectedid = id;
    var modal = Modal('.modal-area', {
        title: 'Edit Events',
        get: {
            url: '/assets/html/Events/editEvents.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="editEvents()" class="createBtn">Edit</button>`,
    });
    modal.on('open', async (modal) => {
        var form = document.getElementById('editEventForm');
        setPlaceHolders(form, 'Loading...');
        
        var res = await fetch("/event/api/" + selectedid);
        if (!res.ok) {
            alert((await res.json()).message);
            setPlaceHolders(form, 'No data found');
            return;
        }
        var data = await res.json();
        document.getElementById('name').value = data.name;
        document.getElementById('description').value = data.description;
        document.getElementById('closureDate').value = data.closureDate.split('T')[0];
        document.getElementById('finalClosureDate').value = data.finalClosureDate.split('T')[0];
        await populateDepartmentData();
        departmentList.forEach(department => {
                var option = document.createElement('option');
                option.value = department._id;
                option.innerHTML = department.name;
                document.getElementById('department').appendChild(option);
        });
        await populateCategoryData();
        categoryList.forEach(category => {
            var option = document.createElement('option');
            option.value = category._id;
            option.innerHTML = category.name;
            document.getElementById('category').appendChild(option);
        });
        
        setPlaceHolders(form, '');
    });
    modal.on('close', (modal) => {
        selectedid = null;
    });
    modal.open();
}

async function createEvents() {
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var closureDate = document.getElementById('closureDate').value;
    var finalClosureDate = document.getElementById('finalClosureDate').value;
    var department = document.getElementById('department').value;
    var category = document.getElementById('category').value;
    var data = {
        name: name,
        description: description,
        closureDate: closureDate,
        finalClosureDate: finalClosureDate,
        department: department,
        category: category,
    }
    try {
        var response = await fetch('/event/api/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        });
        var data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = "/ideas";
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

async function editEvents() {
    var id = selectedid;
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var closureDate = document.getElementById('closureDate').value;
    var finalClosureDate = document.getElementById('finalClosureDate').value;
    var department = document.getElementById('department').value;
    var category = document.getElementById('category').value;
    var data = {
        _id: id,
        name: name,
        description: description,
        closureDate: closureDate,
        finalClosureDate: finalClosureDate,
        department: department,
        category: category,
    }
    try {
        var response = await fetch('/event/api/' + selectedid + '/update', {
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
            window.location.href = "/ideas";
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

async function deleteEvent(id) {
    var x = confirm("Are you sure you want to delete this event?");
    if (x) {
        try {
            var res = await fetch('/event/api/' + id + '/delete', {
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
                loadEventTable();
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


function setPlaceHolders(form, text) {
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].placeholder = text;
    }
}

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

async function populateDepartmentData() {
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

async function populateCategoryData() {
    if (!categoryList) {
        categoryList = [];
        var data = await fetch('/category/api/all');
        var departments = (await data.json()).data;
        for (var c of departments) {
            categoryList.push(c);
        }
        return categoryList;
    }
    
    
}

window.onload = async (e) => {
    loadEventTable();
}