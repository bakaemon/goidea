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
                        <button class="actionBtn fa fa-pencil-square-o"
                                                onclick="editUser('${row._id}')">Edit</button>
                        <button class="actionBtn fa fa-trash-o" onclick="deleteAccount('${row._id}')">Delete</button>
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



async function editUser(id) {
    document.getElementById('id01').style.display = 'block'
}


async function deleteAccount(id) {
    var x = confirm("Are you sure you want to delete this account?");
    if (x) {
        try {
            var res = await fetch('/auth/api/admin_remove', {
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

window.onload = async (e) => {
    loadTable();
}