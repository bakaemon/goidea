
const upVote = (id) => {
        fetch (`/ideas/api/${id}/vote/upvote`, {
            method: 'POST',
        })
        .then(res => res.json())
        .then(data => {
           if(data.success){
               console.log('You have successfully upvoted this idea');
               location.reload();
              } else {
                console.Log('upvote failed')
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
               location.reload();
              } else {
                console.Log('downvote failed')
           }
        }
    )
}

const getVoteCount = (id) => {
    fetch(`/ideas/api/${id}/vote`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
}
