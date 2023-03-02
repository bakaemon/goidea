var selectedid = null;
var modalArea = document.getElementById('modal-area');

async function createDepartmentForm(e) {
    var modal = Modal('.modal-area', {
        title: 'Create New Department',
        get: {
            url: '/assets/html/createDepartment.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="createDepartments()" class="createBtn">Create</button>`,
    });
    modal.open();
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