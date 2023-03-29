
const upVote = (id) => {
        fetch (`/ideas/api/${id}/vote/upvote`)
        .then(res => res.json())
        .then(data => {
           if(data.success){
               console.log('You have successfully upvoted this idea');
               getVoteCount();
              } else {
                console.log('upvote failed')
           }
        }
    )
}

const downVote = (id) => {
        fetch (`/ideas/api/${id}/vote/downvote`)
        .then(res => res.json())
        .then(data => {
           if(data.success){
               console.log('You have successfully downvoted this idea');
               getVoteCount();
              } else {
                console.log('downvote failed')
           }
        }
    )
}

const getVoteCount = (id) => {
    fetch(`/ideas/api/${id}/vote`)
    .then(res => res.json())
    .then(data => {
        $('#voteCount').text(data.data)
    })
}

window.addEventListener('load', () => {
    getVoteCount(ideaId)
})
