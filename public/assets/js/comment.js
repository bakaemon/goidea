async function uploadComments() {
    var comment = tinymce.get('comment').getContent();
    var emailNotify = document.getElementById('note').checked;
    var data = {
        comment: comment,
        emailNotify: emailNotify,
    }
    try {
        var response = await fetch('/ideas/api/comments/create', {
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


const commentDetail = async (comment) => {
    `<div class="topwrap">
        <div class="userinfo pull-left">
            <div class="avatar">
                <img height="50" width="50"  src="${comment.author}" alt="" />
                <div class="status green">&nbsp;</div>
            </div>
            <div class="icons">
                <img src="images/icon3.jpg" alt="" /><img src="images/icon4.jpg" alt="" /><img
                src="images/icon5.jpg" alt="" /><img src="images/icon6.jpg" alt="" />
             </div>
        </div>
        <div class="posttext pull-left">
            <p>${comment.content}</p>
        </div>
        <div class="clearfix"></div>
        </div>
        <div class="postinfobot">
            <div class="likeblock pull-left">
                <div id="the-id" class="upvotejs pull-left">
                <a class="upvote"></a>
                <span class="count">${idea.vote || 0}</span>
                <a class="downvote"></a>
                <a class="star"></a>
                </div>
            </div>
            </div>
            <div class="prev pull-left">
                 <a href="#"><i class="fa fa-reply"></i></a>
            </div>
            <div class="posted pull-left"><i class="fa fa-clock-o"></i> Posted on : ${comment.createdAt}</div>
            <div class="next pull-right">
                <a href="#"><i class="fa fa-share"></i></a>

                <a href="#"><i class="fa fa-flag"></i></a>
        </div>
        <div class="clearfix"></div>
    </div>`
}

if (!commentId) {
    alert('Unable to get comment id!');
    window.history.back();
}

const loadCommentDetail = async () => {
    var response = await fetch('/ideas/api/comments/all');
    if (!response.ok) {
        alert('Failed to load comment detail!');
        return;
    }
    var data = await response.json();
    $('#comment').html(commentDetail(data));
}

window.addEventListener('load', async () => {
   await loadCommentDetail();
})