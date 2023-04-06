var ideaData;

var tableRow = (idea) => {
    return `
    <tr id="${idea._id}">
        <td>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" >
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


document.addEventListener('docContentLoaded', function() {
        var ideaId;
        var checkBoxAll = $('#checkbox-all');
        var ideaItemCheckbox = $('input[name"ideaIdS[]"]');
        var checkAllSubmit = $('.btn-check-all-submit');


        checkBoxAll.change(function() {
            var isChecked = $(this).prop('checked');
            ideaItemCheckbox.prop('checked', isChecked);
            renderCheckAllBtn();

        })

        ideaItemCheckbox.change(function () {
            var isChecked = ideaItemCheckbox.lenght === $('input[name"ideaIdS[]"]:checked').lenght
            checkBoxAll.prop('checked', isChecked);
            renderCheckAllBtn();
        });  

        function renderCheckAllBtn() {
            var checkedCount = $('input[name"ideaIdS[]"]:checked').lenght;
            if (checkedCount > 0) {
                checkAllSubmit.removeClass('disabled');
            } else {
                checkAllSubmit.addClass('disabled');
            }
        }
    });

    function convertArrayToCsv(dataArray, filename) {
        // define the CSV header and rows
        const header = Object.keys(dataArray[0]);
        const rows = [];
    
        dataArray.forEach(function(item) {
            const row = [];
    
            for (const property in item) {
                if (item.hasOwnProperty(property)) {
                    const value = item[property];
                    row.push(`"${String(value).replace(/"/g, '""')}"`);
                }
            }
    
            rows.push(row.join(','));

        });
        var csvContent = header.join(',') + '\n' + rows.join('\n');

        csvContent = encodeURI(csvContent);

        return csvContent;
        

    }
      
    function downloadCSV(array, filename) {
        const csv = convertArrayToCsv(array);
        const url = 'data:text/csv;charset=utf-8,' + csv;
        const link = document.createElement('a');
        link.setAttribute("href", url);
        link.setAttribute("download", filename + ".csv");
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
                tags: idea.tags.map( tag => tag.name ).join(','),
                category: idea.category.name,
                anonymous: idea.anonymous? "true" : "false",
                flags: idea.flags? idea.flags.join(',') : "no flags", 
                files: idea.files? idea.files.map(
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