
var eventList;
var categoryList;
var selectedid = null;
var modalArea = document.getElementById('modal-area');
var inputTag;



function viewIdeaForm(e, id) {
    var modal = Modal('.modal-area', {
        title: 'Idea Information',
        get: {
            url: '/assets/html/ideas/editIdeas.html',
            overwrite: true,
        },
        footer: `<button type="button" onclick="#" class="createBtn">Update</button>`,
    });
    modal.open();
}


async function uploadIdeas() {
    var topicName = document.getElementById('topicName').value;
    var tags = (JSON.parse(inputTag.getInputValue()));
    var events = document.getElementById('events').value;
    var description = tinymce.get('desc').getContent();
    var identify = document.getElementById('anon').checked;
    var category = document.getElementById('category').value;
    // var files = [...document.getElementById('files').files];
    var files = currentFilesUpload;
    var formData = new FormData();
    var term = document.getElementById('note').checked;
    if (!term) {
        alert("Please accept the terms and conditions")
        return;
    }
    if (topicName == "" || tags.length == 0 || events == "" || description == "" || category == "") {
        alert("Please fill all the fields");
        return;
    }

    var data = {
        title: topicName,
        event: events,
        tags: tags.map(tag => tag.value),
        description: description,
        anonymous: identify,
        category: category,
        

    }
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    for(var key in data) {
        formData.append(key, data[key]);
    }
    try {
        var response = await fetch('/ideas/api/create', {
            method: "POST",
            body: formData

        });
        var data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = "/home";
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


async function populateCategoryData() {
    if (!categoryList) {
        categoryList = [];
        var data = await fetch('/category/api/all');
        var category = (await data.json()).data;
        for (var c of category) {
            categoryList.push(c);
        }
        return categoryList;
    }
}

async function populateEventData() {
    if (!eventList) {
        eventList = [];
        var data = await fetch('/event/api/all');
        var event = (await data.json()).data;
        for (var e of event) {
            eventList.push(e);
        }
        return eventList;
    }
}

const loadCategory = async () => {
    var category = await populateCategoryData();
    category.forEach(category => {
        var option = document.createElement('option');
         $(option).attr('data-tokens', () => category.name)
         $(option).text(category.name)
         $(option).val(category._id)
        // option.value = category._id;
        // option.innerHTML = category.name;
        document.getElementById('category').appendChild(option);
    });
    $('#category').selectpicker()
}

const loadEvent = async () => {
    var event = await populateEventData();
    event.forEach(event => {
        var option = document.createElement('option');
        $(option).attr('data-tokens', () => event.name)
        $(option).text(event.name)
        $(option).val(event._id)
        document.getElementById('events').appendChild(option);
    });
    $('#events').selectpicker()
}
// window.onload = async (e) => {
//     loadTableDepartment();
// }

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

window.onload = async (e) => {
    await loadCategory();
    await loadEvent();
    inputTag = new Tagify(document.querySelector('input[name=tags]'))
}
