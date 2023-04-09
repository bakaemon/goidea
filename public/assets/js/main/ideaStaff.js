var eventList;
var categoryList;
var tagList;

const loadIdeaForm = async () => {
    var idea = await (await fetch('/ideas/api/' + ideaId)).json();
    document.getElementById('topicName').value = idea.title;
    document.getElementById('desc').value = idea.description;
    document.getElementById('anon').checked = idea.anonymous;
    document.getElementById('category').value = idea.category._id;
    document.getElementById('events').value = idea.event._id;
    document.getElementById('tags').value = idea.tags.map(tag => tag._id);
    var category = await populateCategoryData();
    category.forEach(category => {
        var option = document.createElement('option');
        $(option).attr('data-tokens', () => category.name)
        $(option).text(category.name)
        $(option).val(category._id)
        document.getElementById('category').appendChild(option);
    });
    $('#category').selectpicker()

    var event = await populateEventData();
    event.forEach(event => {
        var option = document.createElement('option');
        $(option).attr('data-tokens', () => event.name)
        $(option).text(event.name)
        $(option).val(event._id)
        document.getElementById('events').appendChild(option);
    });
    $('#events').selectpicker()

    var tags = await populateTagData();
    tags.forEach(tag => {
        var option = document.createElement('option');
        $(option).attr('data-tokens', () => tag.name)
        $(option).text(tag.name)
        $(option).val(tag._id)
        document.getElementById('tags').appendChild(option);
    });
    $('#tags').selectpicker()
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

window.addEventListener('load', async () => {
    await loadIdeaForm();
    document.getElementById('submit').addEventListener('click', editIdea);
});