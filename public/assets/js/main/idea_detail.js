var ideaDetail;

const files = (fileNames) => {
    var html = '<div class="file">';
    for (var fileName of fileNames) {
        var file = fileName.split('.');
        var ext = file[1];
        
        var exts = {
            jpg: ['jpg', 'jpeg'],
            mp4: ['mp4'],
            png: ['png'],
            pdf: ['pdf'],
            doc: ['doc', 'docx'],
            ppt: ['ppt', 'pptx'],
            xls: ['xls', 'xlsx'],
            zip: ['zip', 'rar', '7z'],
        }
        var matchExt = 'file';
        for (var key in exts) {
            if (exts[key].includes(ext)) {
                matchExt = key;
                break;
            } 
        }
        html += `
                        <a href="/assets/uploads/${fileName}" target="_blank" title="${fileName}" download>
                            <img src="/assets/images/filetypes/${matchExt}.png" alt="${fileName}" style="width: 75px; height: 75px; "/>
                        </a>
                    `
    }
    html += '</div>';
    return html;
    
}
const detailModel = (idea) => `
                <div class="topwrap">
                    <div class="userinfo pull-left">
                        <div class="avatar">
                            <img height="50" width="50"  src="${idea.author.avatar}" alt="" />
                            <div class="status green">&nbsp;</div>
                        </div>

                        <div class="icons">
                            <img src="/assets/images/icon1.jpg" alt="" /><img src="/assets/images/icon4.jpg" alt="" /><img
                                src="/assets/images/icon5.jpg" alt="" /><img src="/assets/images/icon6.jpg" alt="" />
                        </div>
                    </div>
                    <div class="posttext pull-left">
                        <h2>${idea.title}</h2>
                        <div class="department">
                            <a href="/home?keyword=${idea.event.department.name.split(' ').join("+") }"><span class="badge" style="background-color: red">Department: [${idea.event.department.name}]</span></a>
                        </div>
                        <!-- show tags -->
                        <div class="tags">
                            <a href="/home?keyword=${idea.category.name.split(' ').join("+")}"><span class="badge" style="background-color: orange">#${idea.category.name}</span></a>
                            ${idea.tags.map(tag => `<a href="/home?keyword=${tag.name}"><span class="badge badge-primary">#${tag.name}</span></a>`).join(' ')}
                        </div>
                        <br/><br/>
                        <p>${idea.description}</p>            
                        <br>
                        <br>
                        <h5>Attachments</h5>
                        <!-- show files -->
                        <div class="files">
                            ${files(idea.files)}
                        </div>

                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="postinfobot">

                    <div class="likeblock pull-left">
                        <a href="#" class="up up-idea"><i class="fa-regular fa-up" id='u-idea'></i></a>
                        <i id="ideaVote" >0</i>
                        <a href="#" class="down down-idea"><i class="fa-regular fa-down" id='d-idea'></i></a>
                    </div>

                    <div class="prev pull-left">
                        <a href="#"><i class="fa fa-reply"></i></a>
                    </div>

                    <div class="posted pull-left"><i class="fa fa-clock-o"></i> Posted on : ${idea.createdAt}</div>

                    <div class="next pull-right" id="staff-update">
                    </div>

                    <div class="clearfix"></div>
                </div>
`

const generateStaffUpdate = async () => {
    if (!checkAuth()) {
        return;
    }
    const staffUpdate = document.getElementById('staff-update');
    var res = await fetch('/auth/api/verify_token?token=' + getCookie('token'))
    if(!res.ok) {
        return;
    }
    var account = await res.json();
    console.log(ideaDetail)
    if (account._id == ideaDetail.author._id) {
        const html = `
            <a href="/home/idea/${ideaId}/edit"><i class="fa fa-edit"></i></a>
            <a href="javascript:deleteIdea()"><i class="fa fa-trash"></i></a>`;
        staffUpdate.innerHTML = html;
    }
}

if (!ideaId) {
    alert('Something went wrong!');
    window.history.back();
}

const loadIdeaDetail = async () => {
    var response = await fetch('/ideas/api/' + ideaId);
    if (!response.ok) {
        alert('Something went wrong! The idea may not existed!');
        window.history.back();
        return;
    }
    var data = await response.json();
    ideaDetail = data;
    document.title = data.title + ' | GoIdea';
    $('#idea').html(detailModel(data));
    await generateStaffUpdate();
}

const deleteIdea = async () => {
    confirm('Are you sure you want to delete this idea?') ? await (async () => {
        var response = await fetch(`/ideas/api/${ideaId}/delete`, {
            method: "DELETE"
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
    })() : null;
}

window.addEventListener('load', async () => {
    var transition =  new Transition('.container-fluid');
    transition.start();
    document.title = 'Loading... | GoIdea';
    await loadIdeaDetail();
    var voteData = await getVoteCount(ideaId);
    var upBtn = $('#u-idea');
    var downBtn = $('#d-idea');
    if (voteData.voteStatus != null) {
        if (voteData.voteStatus == 'upvoted') {
            upBtn.toggleClass('fa-regular fa-solid');
        } else if (voteData.voteStatus == 'downvoted') {
            downBtn.toggleClass('fa-regular fa-solid');
        }
    }
    var up = $('.up-idea');
    var down = $('.down-idea');
    $('#ideaVote').text(voteData.data)
    up.on('click', () => {
        upVote(ideaId)
            .then(data => {
                if (data.success) {
                    
                    upBtn.toggleClass('fa-regular fa-solid');
                    if (downBtn.hasClass('fa-solid')) {
                        downBtn.toggleClass('fa-regular fa-solid');
                    }
                    $('#ideaVote').html(data.data.toString())
                } else {
                    console.log('upvote failed')
                }
            });
    });
    down.on('click', () => {
        downVote(ideaId)
            .then(data => {
                if (data.success) {
                    downBtn.toggleClass('fa-regular fa-solid');
                    if (upBtn.hasClass('fa-solid')) {
                        upBtn.toggleClass('fa-regular fa-solid');
                    }
                    $('#ideaVote').html(data.data.toString())
                } else {
                    console.log('downvote failed')
                }
            }
            )
    });
    await new Promise(resolve => setTimeout(resolve, 250));
    transition.end();
})

