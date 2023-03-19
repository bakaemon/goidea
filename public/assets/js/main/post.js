
var postModel = (idea) => {
    return `
    <div class="post">
        <div class="wrap-ut pull-left">
            <div id="the-id" class="upvotejs pull-left">
                <a class="upvote"></a>
                <span class="count">${idea.vote || 0}</span>
                <a class="downvote"></a>
                <a class="star"></a>
            </div>
        <!--<div class="userinfo pull-left">
            <div class="avatar">
                <img src="${idea.author.avatar}" alt="" />
                <div class="status green">&nbsp;</div>
            </div>
    
            <div class="icons">
                <img src="assets/images/icon1.jpg" alt="" /><img src="assets/images/icon4.jpg" alt="" />
            </div>
        </div>-->
        <div class="posttext pull-left">
            <h2><a href="/home/idea/${idea._id}">${idea.title}</a></h2>
            <p>${idea.description}</p>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="postinfo pull-left">
        <div class="comments">
            <div class="commentbg">
                560
                <div class="mark"></div>
            </div>
    
        </div>
        <div class="views"><i class="fa fa-eye"></i> 1,568</div>
        <div class="time"><i class="fa fa-clock-o"></i>${idea.time}</div>                                    
    </div>
    <div class="clearfix"></div>

    `
}

const getIdeaData = async () => {
    var response = await fetch('/ideas/api/all');
    if(!response.ok) {
        alert('Faile to get idea from server!')
        return;
    }
    var ideas = ( await response.json()).data;
    return ideas;
}



const loadPost = async () => {
    var posts =  document.getElementById('posts');
    var ideaData = await getIdeaData()
    console.log(ideaData)
    ideaData.forEach(post => {
        posts.innerHTML += postModel(post)
    })
}

window.onload = async () => {
    await loadPost()
} 
