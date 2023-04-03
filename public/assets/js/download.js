async function loadTableDepartment() {
    var tableArea = document.getElementById('table-area');
    tableArea.innerHTML = "";
    var table = document.createElement('table');
    table.style.width = '100%';
    table.id = 'information';
    document.getElementById('table-area').appendChild(table);
    // fetch("https://raw.githubusercontent.com/fiduswriter/simple-datatables/main/docs/demos/18-fetch-api/demo.json")
    fetch('/ideas/api/all', { headers: { 'Authorization': 'Bearer ' + getCookie('token') } })
        .then(
            response => response.json()
        ).then(
            resData => {
                var data = resData.data;
                if (!data.length) {
                    return
                }
                var newHeaders = Object.keys(data[0]);
                newHeaders[newHeaders.indexOf('_id')] = 'ID';
                newHeaders.shift();
                newHeaders = newHeaders.filter((item) => item != '__v' && item != 'updatedAt' && item != 'createdAt');
                newHeaders.push('Actions');
                var newRows = [];
                for (var row of data) {
                    var newRow = [];
                    for (var key in row) {
                        if (key == 'roles') {
                            newRow.push(row[key].join(', '));
                        }
                        else if (key == '__v' || key == 'updatedAt' || key == 'createdAt' || key == '_id') {
                            continue;
                        } else newRow.push(row[key]);
                    }
                    newRows.push(`
                        <input class="form-check-input" type="checkbox"  name="${idea._id}[]" value="${this.id}"></input>`
                            
                    );
                    newRows.push(newRow);
                }
                console.log(newRows);
                new simpleDatatables.DataTable(table, {
                    data: {
                        headings: newHeaders,
                        data: newRows
                    }
                })
            }
        )
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

    function tableToCSV() {
 
        var csv_data = [];
     
        var rows = document.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
     
            var cols = rows[i].querySelectorAll('td,th');
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) {
                csvrow.push(cols[j].innerHTML);
            }
            csv_data.push(csvrow.join(","));
        }
        csv_data = csv_data.join('\n');

        downloadCSVFile(csv_data);
    }


    function downloadCSVFile(csv_data) {
 
        CSVFile = new Blob([csv_data], { type: "text/csv" });
     
        var temp_link = document.createElement('a');
     
        temp_link.download = "GfG.csv";
        var url = window.URL.createObjectURL(CSVFile);
        temp_link.href = url;
     
        temp_link.style.display = "none";
        document.body.appendChild(temp_link);
     
        temp_link.click();
        document.body.removeChild(temp_link);
    }
