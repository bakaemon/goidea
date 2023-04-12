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

// // Function to download files
// function downloadFile(url, fileName) {
//     fetch(url).then(function (t) {
//         return t.blob().then((blob) => {
//             // Create a download link with the blob
//             var a = document.createElement("a");
//             a.href = window.URL.createObjectURL(blob);
//             a.download = fileName;
//             a.click();
//         })
//     })
// }

// // Create an array of file URLs to download
// function getFile() {
//     var fileUrls = ideaData.files.map(filename => '/assets/uploads/' + filename);

//     // Loop through file URLs and download each file
//     var downloadedFiles = [];
//     var promiseArray = [];

//     for (var i = 0; i < fileUrls.length; i++) {
//         var promise = fetch(fileUrls[i]).then(function (response) {
//             var content = response.blob();
//             return {
//                 name: fileUrls[i].match(/[^\/\\]+$/)[0],
//                 data: content
//             };
//         });
//         promiseArray.push(promise);
//     }

//     Promise.all(promiseArray).then(function (results) {
//         // Create a zip object
//         var zip = new JSZip();

//         // Add each file to the zip object
//         for (var j = 0; j < results.length; j++) {
//             zip.file(results[j].name, results[j].data, { binary: true });
//         }

//         // Generate a zip file and download it
//         zip.generateAsync({ type: "blob" }).then(function (content) {
//             downloadFile(URL.createObjectURL(content), 'download.zip');
//         });
//     });
// }

function downloadFilesAsZip() {
    // Fetch a list of the user's uploaded files from the server
    fetch('/ideas/api/all')
        .then(response => response.json())
        .then(ideaData => {
            const files = ideaData.data.map(filename => '/assets/fileUpload/' + filename);

            if (!files || !Array.isArray(files)) {
                // Handle the case where the files array is missing or not an array
                console.error('Invalid or missing files array:', files);
                return;
            }

            // Create a zip object
            const zip = new JSZip();

            // Loop through the files and download each file
            const promises = files.map(file => {
                // Fetch the file's contents
                return fetch(file.url)
                    .then(response => response.blob())
                    .then(blob => {
                        // Add the file to the zip object
                        zip.file(file.name, blob, { binary: true });
                    });
            });

            // Wait for all the files to be downloaded and added to the zip object
            Promise.all(promises).then(() => {
                // Generate a zip file and download it
                zip.generateAsync({ type: "blob" }).then(content => {
                    downloadFile(URL.createObjectURL(content), 'my_files.zip');
                });
            });
        });
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