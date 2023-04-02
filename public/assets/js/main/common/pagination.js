const examplePaginationData = {
    "totalDocs": 3,
    "limit": 10,
    "totalPages": 1, "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": false,
    "prevPage": null,
    "nextPage": null
}

const Paginator = (function (selector, movePageCallback = (page) => { }) {
    const movePage = movePageCallback;

    const template = (pages, currentPage, prevPage, nextPage, hasPrevPage, hasNextPage) => {
        var html = '';
        var prevBtn = '';
        var nextBtn = '';
        if (hasPrevPage) {
            prevBtn = `<div class="pull-left"><a href="javascript:movePage(${prevPage})" class="prevnext"><i class="fa fa-angle-left"></i></a></div>`;
        }
        else {
            prevBtn = `<div class="pull-left"><a href="javascript:void(0)" class="prevnext"><i class="fa fa-angle-left"></i></a></div>`;
        }
        if (hasNextPage) {
            nextBtn = `
            <div class="pull-left"><a href="javascript:movePage(${nextPage})" class="prevnext last"><i class="fa fa-angle-right"></i></a></div>
        `;
        }
        else {
            nextBtn = `
            <div class="pull-left"><a href="javascript:void(0)" class="prevnext last"><i class="fa fa-angle-right"></i></a></div>
        `;
        }
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page === currentPage) {
                html += `<li class="active"><a href="#">${page}</a></li>`;
            } else {
                html += `<li><a href="javascript:movePage(${page})">${page}</a></li>`;
            }
            if (i === 2) {
                html += `<li><a href="#">...</a></li>`;
                html += `<li><a href="javascript:movePage(${pages[pages.length - 1]})">${pages[pages.length - 1]}</a></li>`;
                break;
            }

        }

        return `
        <div class="row">
        <div class="col-lg-8">
            ${prevBtn}
            <div class="pull-left">
                <ul class="paginationforum">
                    ${html}
                </ul>
            </div>
            ${nextBtn}
            <div class="clearfix"></div>
        </div>
    </div>
`
    }
    const paginate = (paginationData) => {
        const { currentPage, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = paginationData;
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
            }
            else if (currentPage > 3 && currentPage <= totalPages - 3) {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
            else {
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
        }

        var html = template(pages, currentPage, prevPage, nextPage, hasPrevPage, hasNextPage);

        document.querySelectorAll(selector).forEach((el) => {
            el.innerHTML = html;
        });
    }

    return {
        paginate,
        movePage
    }

})