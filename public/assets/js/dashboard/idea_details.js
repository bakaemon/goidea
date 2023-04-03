// load ideas by event id table
var selectedid = null;
const loadIdeasByEventId = async () => {

    var tableArea = document.getElementById('table-area-ideas');
    tableArea.innerHTML = "";
    var table = document.createElement('table');
    table.style.width = '100%';
    table.id = 'information';
    document.getElementById('table-area-ideas').appendChild(table);
    var res = await fetch(`/event/api/${eventId}/ideas`, { headers: { 'Authorization': 'Bearer ' + getCookie('token') } });
    var resData = await res.json();
    var data = resData.data;
    if (!data.length) {
        return
    }
    var newHeaders = Object.keys(data[0]);
    newHeaders = newHeaders.filter((item) => item != '__v' && item != 'updatedAt' && item != 'createdAt' 
    && item != 'event' && item != 'flag' && item != 'anonynous' && item != 'tags' && item != '_id');
    newHeaders.push('Actions');
    var newRows = [];
    for (var row of data) {
        var newRow = [];
        for (var key in row) {
            if (key == '__v' || key == '_id'|| key == 'updatedAt' || key == 'createdAt' || key == 'event' || key == 'flag' || 
            key == 'anonynous' || key == 'tags' ) {
                continue;
            } else newRow.push(row[key]);
        }
        newRow.push(`
            <a class="actionBtn modal-trigger"
                                                    onclick="editIdea(this, '${row._id}')" modal-param="${row._id}">Edit</a>
            <button class="actionBtn" onclick="deleteIdea('${row._id}')">Delete</button>
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

async function deleteIdea(ideaId) {
    var x = confirm("Are you sure you want to delete this idea?");
    if(x){
        try{
            var res = await fetch(`/ideas/api/${ideaId}/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + getCookie('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ideaId: ideaId
        })
        });
        var resData = await res.json();
        if (resData.status == 'success') {
            loadIdeasByEventId();
        }
        else {
            alert(resData.message);
        }
        }   catch(error){
                alert(error);
            }
    } 
    else{
        return;
    }  
    
}

async function editIdea(button, ideaId) {
    selectedid = ideaId;
    var modal = Modal(".modal-area", {
        title:"Edit Idea",
        get:{url: ""},
        body:`
        <form id="editForm">
            <div class="container">
                <label for="Title"><b>Title</b></label>
                <input type="text" placeholder="Title" id="title" name="title" required>
                <label for="Description"><b>Description</b></label>
                <br>
                <textarea placeholder="Description" id="description" name="description" style="width: 100%;" required></textarea>
            </div>
        </form>`,
        footer:`<button type="button" onclick="updateIdea()" class="editBtn">Edit</button>`
   });
   modal.on("open", async (modal) => {
    var response = await fetch(`/ideas/api/${selectedid}`);
    console.log('loading...')
    if(!response.ok) {
        alert("Something went wrong!!!")
        return;
    }
    var data = await response.json();
    var title = document.getElementById('title');
    var description = document.getElementById('description');
    title.value = data.title;
    description.value = data.description;
    console.log(data);
    console.log('close')
    });

    modal.on("close", (modal) => {
        return confirm("Do you want to exit without save???") ? alert("Closing") : null;
    });
    
    modal.open();
}

async function updateIdea() {
    var title = document.getElementById('title');
    var description = document.getElementById('description');
    var data = {
        title: title.value,
        description: description.value,
        id : selectedid
    }
    var res = await fetch(`/ideas/api/${selectedid}/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        },
        body: JSON.stringify(data)
    });
    var resData = await res.json();
    if (resData.status == 'success') {
        loadIdeasByEventId();
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

window.addEventListener('load', () => {
    loadIdeasByEventId(eventId);
});