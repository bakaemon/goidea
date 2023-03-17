var loadTop5Category = function () {
    console.log('Loading top 5 categories');
    $.ajax({
        url: '/category/api/all?limit=5&sort=createdAt&sortMode=-1',
        type: 'GET',
        success: function (json) {
            var data = json.data;
            var html = '';
            data.forEach(function (item) {
                var name = item.name;
                var count = item.count;
                html += `<li><a href="/category/${name}">${name} <span class="badge pull-right">${count}</span></a></li>`;
            });
                
            $('ul.cats').html(html);
        }
    });
};

var loadTop5Ideas = function () {
    $.ajax({
        url: '/api/idea/get?top=5',
        type: 'GET',
        success: function (data) {
            var html = '';
            $.each(data, function (index, item) {
                var title = item.title;
                var id = item._id;
                html += `<div class="divline"></div>
                            <div class="blocktxt">
                                <a href="/idea/${id}">${title}</a>
                            </div>`;
            });
            $('#popularIdeas').html(html);
        }
    });
}

var loadDepartments = function () {
    $.ajax({
        url: '/api/department/get',
        type: 'GET',
        success: function (data) {
            var html = '';
            $.each(data, function (index, item) {
                var name = item.name;
                var id = item._id;
                html += `<li><a href="/department/${id}">${name}</a></li>`;
            });
            $('#departments').html(html);
        }
    });
}



