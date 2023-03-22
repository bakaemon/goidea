
var eventList;
var categoryList;
var selectedid = null;
var modalArea = document.getElementById('modal-area');
var textarea = document.getElementById('desc');


var initEditor = () => {

    var config = {
        skin: "rounded-corner",
        // toolbar: "basic",
        file_upload_handler: function (file, callback, optionalIndex, optionalFiles) {
            var uploadhandlerpath = "/imageupload.ashx";

            console.log("upload", file, "to", uploadhandlerpath)

            function append(parent, tagname, csstext) {
                var tag = parent.ownerDocument.createElement(tagname);
                if (csstext) tag.style.cssText = csstext;
                parent.appendChild(tag);
                return tag;
            }

            var uploadcancelled = false;

            var dialogouter = append(document.body, "div", "display:flex;align-items:center;justify-content:center;z-index:999999;position:fixed;left:0px;top:0px;width:100%;height:100%;background-color:rgba(128,128,128,0.5)");
            var dialoginner = append(dialogouter, "div", "background-color:white;border:solid 1px gray;border-radius:15px;padding:15px;min-width:200px;box-shadow:2px 2px 6px #7777");

            var line1 = append(dialoginner, "div", "text-align:center;font-size:1.2em;margin:0.5em;");
            line1.innerText = "Uploading...";

            var totalsize = file.size;
            var sentsize = 0;

            if (optionalFiles && optionalFiles.length > 1) {
                totalsize = 0;
                for (var i = 0; i < optionalFiles.length; i++) {
                    totalsize += optionalFiles[i].size;
                    if (i < optionalIndex) sentsize = totalsize;
                }
                console.log(totalsize, optionalIndex, optionalFiles)
                line1.innerText = "Uploading..." + (optionalIndex + 1) + "/" + optionalFiles.length;
            }

            var line2 = append(dialoginner, "div", "text-align:center;font-size:1.0em;margin:0.5em;");
            line2.innerText = "0%";

            var progressbar = append(dialoginner, "div", "border:solid 1px gray;margin:0.5em;");
            var progressbg = append(progressbar, "div", "height:12px");

            var line3 = append(dialoginner, "div", "text-align:center;font-size:1.0em;margin:0.5em;");
            var btn = append(line3, "button");
            btn.className = "btn btn-primary";
            btn.innerText = "cancel";
            btn.onclick = function () {
                uploadcancelled = true;
                xh.abort();
            }
            var xh = new XMLHttpRequest();
            xh.open("POST", uploadhandlerpath + "?name=" + encodeURIComponent(file.name) + "&type=" + encodeURIComponent(file.type) + "&size=" + file.size, true);
            xh.onload = xh.onabort = xh.onerror = function (pe) {
                console.log(pe);
                console.log(xh);
                dialogouter.parentNode.removeChild(dialogouter);
                if (pe.type == "load") {
                    if (xh.status != 200) {
                        console.log("uploaderror", pe);
                        if (xh.responseText.startsWith("ERROR:")) {
                            callback(null, "http-error-" + xh.responseText.substring(6));
                        }
                        else {
                            callback(null, "http-error-" + xh.status);
                        }
                    }
                    else if (xh.responseText.startsWith("READY:")) {
                        console.log("File uploaded to " + xh.responseText.substring(6));
                        callback(xh.responseText.substring(6));
                    }
                    else {
                        callback(null, "http-error-" + xh.responseText);
                    }
                }
                else if (uploadcancelled) {
                    console.log("uploadcancelled", pe);
                    callback(null, "cancelled");
                }
                else {
                    console.log("uploaderror", pe);
                    callback(null, pe.type);
                }
            }
            xh.upload.onprogress = function (pe) {
                console.log(pe);
                //pe.total
                var percent = Math.floor(100 * (sentsize + pe.loaded) / totalsize);
                line2.innerText = percent + "%";

                progressbg.style.cssText = "background-color:green;width:" + (percent * progressbar.offsetWidth / 100) + "px;height:12px;";
            }
            xh.send(file);
        }
    };
    
    var editor = new RichTextEditor("#editorjs", config);
}

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
    var tags = document.getElementById('tags').value;
    var events = document.getElementById('events').value;
    var description = textarea.value;
    var identify = document.getElementById('friends').checked;
    var category = document.getElementById('category').value;

    var term = document.getElementById('note').checked;
    if (!term) {
        alert("Please accept the terms and conditions")
        return;
    }
    if (topicName == "" || tags == "" || events == "" || description == "" || category == "") {
        alert("Please fill all the fields");
        return;
    }

    var data = {
        title: topicName,
        event: events,
        description: description,
        anonymous: identify,
    }
    try {
        var response = await fetch('/ideas/api/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

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
        option.value = category._id;
        option.innerHTML = category.name;
        document.getElementById('category').appendChild(option);
    });
}

const loadEvent = async () => {
    var event = await populateEventData();
    event.forEach(event => {
        var option = document.createElement('option');
        option.value = event._id;
        option.innerHTML = event.name;
        document.getElementById('events').appendChild(option);
    });
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

}
