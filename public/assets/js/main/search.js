// search ideas
async function searchIdeas() {
    var search = document.getElementById('search').value;
    var response = await fetch(`/ideas/api/search?keyword=${search}`);
    if (!response.ok) {
        alert('Failed to get idea from server!')
        return;
    }
    var ideas = (await response.json()).data;
    var posts = document.getElementById('posts');
    posts.innerHTML = '';
    ideas.forEach((post) => {
        posts.innerHTML += postModel(post)
        getVoteCount(post._id).then(voteData => {
            $(`#${post._id} span.count`).text(voteData.data);
            if (voteData.voteStatus != null) {
                if (voteData.voteStatus == 'upvoted') {
                    $(`#${post._id} a.upvote`).toggleClass('upvote-on');
                } else if (voteData.voteStatus == 'downvoted') {
                    $(`#${post._id} a.downvote`).toggleClass('downvote-on');
                }
            }
            $(`#${post._id} a.upvote`).on('click', function () {
                upVote(post._id).then((data) => {
                    $(`#${post._id} span.count`).text(data.data);
                    $(`#${post._id} a.upvote`).toggleClass('upvote-on');
                    $(`#${post._id} a.downvote`).removeClass('downvote-on');
                })
            });
            $(`#${post._id} a.downvote`).on('click', function () {

                downVote(post._id).then((data) => {
                    $(`#${post._id} span.count`).text(data.data);
                    $(`#${post._id} a.downvote`).toggleClass('downvote-on');
                    $(`#${post._id} a.upvote`).removeClass('upvote-on');
                })
            });
        })

    })
}