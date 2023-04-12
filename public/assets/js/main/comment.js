async function uploadComments() {
    console.log('uploading comments');
    var comment = tinymce.get('comment').getContent();
    var data = {
        content: comment
    }
    try {
        var response = await fetch('/ideas/api/' + ideaId + '/comments/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        });
        var data = await response.json();
        if (data.success) {
            document.getElementsByClassName('comment-section')[0].innerHTML += commentDetail(data.data);
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

const commentDetail = (comment) => {
    return `<div class="post" id="${comment._id}">
                <div class="topwrap">
                    <div class="userinfo pull-left">
                        <div class="avatar">
                            <img height="50" width="50" src="${comment.author.avatar}" alt="" />
                            <div class="status red">&nbsp;</div>
                        </div>

                        <div class="icons">
                            <img src="/assets/images/icon3.jpg" alt="" /><img src="/assets/images/icon4.jpg" alt="" /><img
                                    src="/assets/images/icon5.jpg" alt="" /><img src="/assets/images/icon6.jpg" alt="" />
                        </div>
                    </div>
                    <div class="posttext pull-left">
                            <h2>${comment.author.displayName}</h2>
                            <div>${comment.content}</div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="postinfobot">
                    <div class="likeblock pull-left">
                        <a class="up up-comment"><i id="u-comment" class="fa-regular fa-up"></i></a>
                            <i id="commentVoteCount" >0</i>
                        <a class="down down-comment"><i id="d-comment" class="fa-regular fa-down"></i></a>
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
                </div>
            </div>`
}

const loadComments = async (page) => {
    var url = '/ideas/api/' + ideaId + '/comments/all';
    if (page) {
        url += '?page=' + page;
    }
    var response = await fetch(url);
    if (!response.ok) {
        alert('Failed to load comments!');
        return;
    }
    var data = await response.json();
    Paginator('#pagination', loadComments).paginate(data.paginationOptions);
    var commentSection = document.getElementsByClassName('comment-section')[0];
    var comments = data.data;
    if (comments.length == 0) {
        commentSection.innerHTML = `<h3>No Comments yet!</h3>`;
        return;
    } else {
        comments.forEach(comment => {

            commentSection.innerHTML += commentDetail(comment);
            var upBtn = $('#' + comment._id + ' #u-comment');
            var downBtn = $('#' + comment._id + ' #d-comment');
            if (comment.voteStatus == 'upvoted') { upBtn.toggleClass('fa-regular fa-solid'); }
            if (comment.voteStatus == 'downvoted') { downBtn.toggleClass('fa-regular fa-solid'); }
            $('#' + comment._id + ' #commentVoteCount').text(comment.voteCount);
            upBtn.click(() => {
                upvoteComment(comment._id);
            });
            downBtn.click(() => {
                downvoteComment(comment._id);
            });
        });
    }
}

// upvote
const upvoteComment = async (commentId) => {
    if (getCookie('token') == null) {
        alert('Please login to upvote comment!');
        return;
    }
    var response = await fetch('/ideas/api/' + ideaId + '/comments/' + commentId + '/vote/upvote', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        alert('Failed to upvote!');
        return;
    }
    var data = await response.json();
    if (data.success) {
        $('#' + commentId + ' #commentVoteCount').text(data.data);
        var upBtn = $('#' + commentId + ' #u-comment');
        var downBtn = $('#' + commentId + ' #d-comment');
        upBtn.toggleClass('fa-regular fa-solid');
        if (downBtn.hasClass('fa-solid')) {
            downBtn.toggleClass('fa-regular fa-solid');
        }
    }
}

// downvote
const downvoteComment = async (commentId) => {
    if (getCookie('token') == null) {
        alert('Please login to downvote!');
        return;
    }
    var response = await fetch('/ideas/api/' + ideaId + '/comments/' + commentId + '/vote/downvote', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        alert('Failed to downvote!');
        return;
    }
    var data = await response.json();
    var commentVote = $('#' + commentId + ' #commentVoteCount');
    if (data.success) {
        var upBtn = $('#' + commentId + ' #u-comment');
        var downBtn = $('#' + commentId + ' #d-comment');
        downBtn.toggleClass('fa-regular fa-solid');
        if (upBtn.hasClass('fa-solid')) {
            upBtn.toggleClass('fa-regular fa-solid');
        }
        
        commentVote.text(data.data);
    }
}

//send notification mail
const sendNotificationMail = async () => {
    var response = await fetch('/testmail', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        alert('Failed to send notification mail!');
        return;
    }
    var data = await response.json();
    if (data.success) {
        alert('Notification mail sent successfully!');
    }
}

window.onload = async () => {
    loadComments();
}