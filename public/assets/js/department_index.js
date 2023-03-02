var selectedid = null;
var modalArea = document.getElementById('modal-area');

async function createDepartmentForm(e) {
    var modal = Modal('.modal-area', {
        title: 'Create New Department',
        get: {
            url: '/assets/html/createDepartment.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="createAccounts()" class="createBtn">Create</button>`,
    });
    modal.open();
}