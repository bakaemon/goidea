
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
                        <p>${idea.description}</p>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="postinfobot">

                    <div class="likeblock pull-left">
                        <a href="#" class="up"><i class="fa-regular fa-up"></i></a>
                        <i id="voteCount" >0</i>
                        <a href="#" class="down"><i class="fa-regular fa-down"></i></a>
                    </div>

                    <div class="prev pull-left">
                        <a href="#"><i class="fa fa-reply"></i></a>
                    </div>

                    <div class="posted pull-left"><i class="fa fa-clock-o"></i> Posted on : ${idea.createdAt}</div>

                    <div class="next pull-right">
                        <a href="#"><i class="fa fa-share"></i></a>

                        <a href="#"><i class="fa fa-flag"></i></a>
                    </div>

                    <div class="clearfix"></div>
                </div>
`

if (!ideaId) {
    alert('Unable to get idea id!');
    window.history.back();
}

const loadIdeaDetail = async () => {
    var response = await fetch('/ideas/api/' + ideaId);
    if (!response.ok) {
        alert('Failed to load idea detail!');
        return;
    }
    var data = await response.json();
    $('#idea').html(detailModel(data));
}


window.addEventListener('load', async () => {
    await loadIdeaDetail();
    var voteData = await getVoteCount(ideaId);
    if (voteData.voteStatus != null) {
        if (voteData.voteStatus == 'upvoted') {
            $('i.fa-up').toggleClass('fa-regular fa-solid');
        } else if (voteData.voteStatus == 'downvoted') {
            $('i.fa-down').toggleClass('fa-regular fa-solid');
        }
    }
    $('#voteCount').text(voteData.data)
    $('.up').on('click', () => {
        upVote(ideaId)
            .then(data => {
                if (data.success) {
                    if ($('i.fa-down').hasClass('fa-solid')) {
                        $('i.fa-down').toggleClass('fa-regular fa-solid');
                    }
                    if ($('i.fa-up').hasClass('fa-regular')) {
                        $('i.fa-up').toggleClass('fa-solid fa-regular');
                    } else {
                        $('i.fa-up').toggleClass('fa-regular fa-solid');
                    }
                    $('#voteCount').html(data.data.toString())
                } else {
                    console.log('upvote failed')
                }
            });
    });
    $('.down').on('click', () => {
        downVote(ideaId)
            .then(data => {
                if (data.success) {
                    if ($('i.fa-up').hasClass('fa-solid')) {
                        $('i.fa-up').toggleClass('fa-regular fa-solid');
                    }
                    if ($('i.fa-down').hasClass('fa-regular')) {
                        $('i.fa-down').toggleClass('fa-solid fa-regular');
                    } else {
                        $('i.fa-down').toggleClass('fa-regular fa-solid');
                    }
                    $('#voteCount').html(data.data.toString())
                } else {
                    console.log('downvote failed')
                }
            }
            )
    });
})

