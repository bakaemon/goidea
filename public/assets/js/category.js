

var selectedid = null;
var modalArea = document.getElementById('modal-area');


async function loadTable() {
    var tableArea = document.getElementById('table-area');
    tableArea.innerHTML = "";
    var table = document.createElement('table');
    table.style.width = '100%';
    table.id = 'information';
    document.getElementById('table-area').appendChild(table);
    // fetch("https://raw.githubusercontent.com/fiduswriter/simple-datatables/main/docs/demos/18-fetch-api/demo.json")
    fetch('/category/api/all', { headers: { 'Authorization': 'Bearer ' + getCookie('token') } })
        .then(
            response => response.json()
        ).then(
            resData => {
                var data = resData.data;
                if (!data.length) {
                    return
                }
                var newHeaders = Object.keys(data[0]);
                newHeaders.shift();
                newHeaders = newHeaders.filter((item) => item != '__v' && item != 'updatedAt' && item != 'createdAt');
                newHeaders.push('Actions');
                var newRows = [];
                for (var row of data) {
                    var newRow = [];
                    for (var key in row) {
                        if (key == '__v' || key == '_id'|| key == 'updatedAt' || key == 'createdAt' ) {
                            continue;
                        } else newRow.push(row[key]);
                    }
                    newRow.push(`
                        <a class="actionBtn modal-trigger"
                                                onclick="editCategory(this, '${row._id}')" modal-param="${row._id}">Edit</a>
                        <button class="actionBtn" onclick="deleteCategory('${row._id}')">Delete</button>
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
function openCreateForm(){
    var modal = Modal(".modal-area", {
        title:"Create Category",
        get:{
            url:'/assets/html/category/createCategory.html'
        },
        footer:`<button type="button" onclick="createCategory()" class="createBtn">Create</button>`
    });

    modal.on("close" , (_) => {
        document.querySelector(".modal-area").innerHTML = '';
    });
    modal.open()

}

async function editCategory(button, id){
    //var response = await fetch('/category/api' + id);
   // var data = await response.json();
   selectedid = id;
   var modal = Modal(".modal-area", {
        title:"Edit Category",
        get:{url: ""},
        body:`
        <form id="editForm">
            <div class="container">
                <label for="name"><b>Name</b></label>
                <input type="text" placeholder="Category Name" id="name" name="name" required>
            </div>
        </form>`,
        footer:`<button type="button" onclick="updateCategory()" class="editBtn">Edit</button>`
   });

   modal.on("open", async (modal) => {
        var response = await fetch(`/category/api/${id}`);
        console.log('loading...')
    console.log('loading...')
    var response = await fetch('/category/api/' + id);

        if(!response.ok) {
            alert("Something went wrong!!!")
            return;
        }
        var data = await response.json();
        var name = document.getElementById('name');
        name.value = data.name;
        console.log('Done')
   });

   modal.on("close", (modal) => {
        return confirm("Do you want to exit without save???") ? alert("Closing") : null;
   })

   modal.open();

   
}
async function createCategory() {
    var name = document.getElementById('name').value;
    var data = {
        name: name,
    };
    try {
        var response = await fetch('/category/api/create', {
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
            window.location.href = "/category";
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

// function createCategory(){
//     var form = document.getElementById("createForm"); 
//     var name = form.name.value;
//     try {
//         fetch("/category/api/create", {
//         method:"POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + getCookie("token")
//         },
//         body: JSON.stringify({
//             name : name
//         })
//     }).then((res)=>{
//         if(!res.ok){
//             alert(res.data.json().message)
//             return;
//         }
//         alert(res.data.json().message)
//         loadTable()
//     })
//     }
//     catch(err){
//         alert(err)
//     }
// }


async function deleteCategory(id) {
    var x = confirm("Are you sure you want to delete this category?");
    if (x) {
        try {
            var res = await fetch('/category/api/' + id + '/delete', {
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

// update seleted category
async function updateCategory() {
    var name = document.getElementById('name').value;
    var data = {
        name: name,
        id: selectedid
    };
    try {
        var response = await fetch('/category/api/' + selectedid + '/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + getCookie("token")
            }
        });
        var data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = "/category";
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
    loadTable();
}