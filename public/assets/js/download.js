// const { file } = require("jszip");

var ideaData;

var tableRow = (idea) => {
    return `
    <tr id="${idea._id}">
        <td>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${'check' + idea._id}">
            </div>
        </td>
        <td>"${idea.title}"</td>
        <td>${idea.description}</td>
        <td>${idea.createdAt}</td>
    </tr>
`}


async function getIdeaData() {
    var response = await fetch('/ideas/api/all');
    var json = await response.json();
    ideaData = json.data;

    return json;
}


function checkAll() {
    const masterCheckbox = document.getElementById("checkbox-all");
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    // Add an event listener to the master checkbox that listens for the change event
    masterCheckbox.addEventListener("change", () => {
        // Loop through all the checkboxes
        checkboxes.forEach((checkbox) => {
            // Set their checked property based on the state of the master checkbox
            checkbox.checked = masterCheckbox.checked;
        });
    });
}

function downloadFoldersAsZip(folders) {
    const zip = new JSZip();

    for (let folder of folders) {
        // create a sub-folder in the zip file with the given name
        const subFolder = zip.folder(folder.name);

        Promise.all(folder.urls.map(url => fetch(url)))
            .then(responses => {
                for (let response of responses) {
                    const filename = response.url.split('/').pop();
                    response.blob().then(blob => {
                        // add each file to the sub-folder within the zip
                        subFolder.file(filename, blob);
                    });
                }
            })
    }

    zip.generateAsync({ type: 'blob' })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'folders.zip';
            link.click();
            URL.revokeObjectURL(link.href);
        });
}

function downloadFilesAsZip() {
    var folders = []
    for (var idea of ideaData) {
        var folder = {
            name: idea.title,
            urls: idea.files.map(fileName => {
                return '/assest/uploads' + fileName;
            })
        }
        folders.push(folder);
    }
    downloadFoldersAsZip(folders);
}

function downloadFile(url, fileName) {
    // Create a download link with the blob
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
}


function convertArrayToCsv(dataArray, filename) {
    const header = Object.keys(dataArray[0]);
    console.log('header:', header)
    const rows = [];

    dataArray.forEach(function (item) {
        const row = [];

        for (const property in item) {
            if (item.hasOwnProperty(property)) {
                const value = item[property];
                row.push(`"${String(value).replace(/"/g, '""')}"`);
            }
        }
        // rows.push(row.join(','));
        rows.push(row);

    });

    // var csvContent = header.join(',') + '\n' + rows.join('\n');
    var csvContent = [[...header], ...rows]

    // Tạo nội dung CSV từ dữ liệu
    csvContent = "data:text/csv;charset=utf-8," + csvContent.map(e => e.join(",")).join("\n");

    // csvContent = encodeURI(csvContent);
    console.log(97, csvContent)


    return encodeURI(csvContent);


}

function downloadCSV(array, filename) {
    const csv = convertArrayToCsv(array);
    // const url = 'data:text/csv;charset=utf-8,' + csv;
    const link = document.createElement('a');
    // link.setAttribute("href", url);

    link.setAttribute("href", csv);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function downloadIdeaDatas() {
    var tableData = ideaData.map(idea => {
        var row = {
            id: idea._id,
            title: idea.title,
            description: idea.description,
            author: idea.author.username,
            event: idea.event.name,
            tags: idea.tags.map(tag => tag.name).join(','),
            category: idea.category.name,
            anonymous: idea.anonymous ? "true" : "false",
            flags: idea.flags ? idea.flags.join(',') : "no flags",
            files: idea.files.length > 0 || idea.file ? idea.files.map(
                file => {
                    return file.split('.')[1];
                }
            ) : "no file",
            createdAt: idea.createdAt,
            updatedAt: idea.updatedAt,
            votes: idea.votes

        }
        return row;
    })
    downloadCSV(tableData, 'fileName.csv');
}

window.onload = async () => {
    await getIdeaData();
    ideaData.forEach(idea => {
        document.getElementById('table-ideas').innerHTML += tableRow(idea);
    });
};