// load ideas by event id table
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

window.addEventListener('load', () => {
    loadIdeasByEventId(eventId);
});