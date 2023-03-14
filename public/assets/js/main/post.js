
var postModel = (idea) => {
    return `
    <div class="post">
        <div class="wrap-ut pull-left">
            <div id="the-id" class="upvotejs pull-left">
                <a class="upvote"></a>
                <span class="count">${idea.vote}</span>
                <a class="downvote"></a>
                <a class="star"></a>
            </div>
        <!--<div class="userinfo pull-left">
            <div class="avatar">
                <img src="${idea.avatar}" alt="" />
                <div class="status green">&nbsp;</div>
            </div>
    
            <div class="icons">
                <img src="assets/images/icon1.jpg" alt="" /><img src="assets/images/icon4.jpg" alt="" />
            </div>
        </div>-->
        <div class="posttext pull-left">
            <h2><a href="#">${idea.title}</a></h2>
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
    </div>
    `
}

const ideaData = [
    {
        avatar: 'assets/images/avatar.jpg',
        title: 'Title Test',
        description: `Today, we're looking at three particularly interesting stories. Pinterest added a new location-based feature on Wednesday that uses Place Pins as a way to map out vacations and favorite areas. Southwest Airlines is providing Wi-Fi access from gate to gate for $8 per day through an onboard hotspot. And in an effort to ramp up its user base, Google Wallet is offering a debit card that can take out cash from.`,
        vote: 12,
        isUpVote: false,
        isDownVote: false,
        commentCount: 22,
        createDate: '2023-1-1T00:00:00Z',
        id: '2123123'
    },
    {
        avatar: 'assets/images/avatar.jpg',
        title: 'Title Test',
        description: '123123123123123123123123123123123123123123123123123123123123123123123123123123123',
        vote: 12,
        isUpVote: false,
        isDownVote: false,
        commentCount: 22,
        createDate: '2023-1-1T00:00:00Z',
        id: '2123123'
    },
    {
        avatar: 'assets/images/avatar.jpg',
        title: 'Title Test',
        description: '123123123123123123123123123123123123123123123123123123123123123123123123123123123',
        vote: 12,
        isUpVote: false,
        isDownVote: false,
        commentCount: 22,
        createDate: '2023-1-1T00:00:00Z',
        id: '2123123'
    }
]

const loadPost = () => {
    var posts = document.getElementById('posts');
    ideaData.forEach(post => {
        post.time = '2h'
        posts.innerHTML += postModel(post)
    })
}

window.onload = () => {
    loadPost()
} 