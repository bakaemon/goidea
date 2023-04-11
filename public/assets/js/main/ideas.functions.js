var inputTag, categoryList = [], eventList = [];
async function loadIdeaForm(){
    var idea = await (await fetch('/ideas/api/' + ideaId)).json();
    document.getElementById('topicName').value = idea.title;
    document.getElementById('desc').value = idea.description;
    document.getElementById('anon').checked = idea.anonymous;
    document.getElementById('category').value = idea.category._id;
    document.getElementById('events').value = idea.event._id;
    document.getElementById('tags').value = idea.tags.map(tag => tag.name).join(', ');
    inputTag.value = idea.tags.map(tag => tag.name).join(' ');
    await populateCategoryData();
    categoryList.forEach(category => {
        var option = document.createElement('option');
        $(option).attr('data-tokens', () => category.name)
        $(option).text(category.name)
        $(option).val(category._id)
        document.getElementById('category').appendChild(option);
    });
    $('#category').selectpicker()

    await populateEventData();
    eventList.forEach(event => {
        var option = document.createElement('option');
        $(option).attr('data-tokens', () => event.name)
        $(option).text(event.name)
        $(option).val(event._id)
        document.getElementById('events').appendChild(option);
    });
    $('#events').selectpicker()

    // idea.files.forEach(fileName => {
    //     var file = new File()
    // })


}



async function editIdea(){
    var topicName = document.getElementById('topicName').value;
    var tags = (JSON.parse(inputTag.getInputValue()));
    var events = document.getElementById('events').value;
    var description = tinymce.get('desc').getContent();
    var files = currentFilesUpload;

    var formData = new FormData();

    formData.append('title', topicName);
    formData.append('event', events);
    formData.append('tags', tags.map(tag => tag.value));
    formData.append('description', description);

    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
        var response = await fetch(`/ideas/api/${ideaId}/update`, {
            method: "PATCH",
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
            
}

async function populateCategoryData() {
        var categories = [];
        var data = await fetch('/category/api/all');
        console.log(data);
        var category = (await data.json()).data;
        for (var c of category) {
            categories.push(c);
        }
        categoryList = categories;
    
}

async function populateEventData() {
        var events = [];
        var data = await fetch('/event/api/all');
        var event = (await data.json()).data;
        for (var e of event) {
            events.push(e);
        }
    eventList = events;
}


window.addEventListener('load', async () => {
    inputTag = new Tagify(document.querySelector('input[name=tags]'));
    await loadIdeaForm();
    
});