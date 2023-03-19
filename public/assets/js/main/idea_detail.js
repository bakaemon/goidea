
const detailModel = (idea) => `
                <div class="topwrap">
                    <div class="userinfo pull-left">
                        <div class="avatar">
                            <img height="50" widht="50"  src="${idea.author.avatar}" alt="" />
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
                        <a href="#" class="up"><i class="fa-regular fa-up"></i>0</a>
                        <a href="#" class="down"><i class="fa-regular fa-down"></i>0</a>
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
    if(!response.ok) {
        alert('Failed to load idea detail!');
        return;
    }
    var data = await response.json();
    $('#idea').html(detailModel(data));
}

const voteIdea = async () => {
   $('.up i, .down i').click(() => {
    console.log("clicked");
    var e = $(this);
    e.toggleClass("fa-regular fa-solid")
   })
}

window.addEventListener('load', async () => {
   await loadIdeaDetail();
   voteIdea()
})

