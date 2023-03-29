
const upVote = (id) => {
    if (!getCookie('token')) {
        alert('Please login to vote!')
        return;
    }
    return fetch(`/ideas/api/${id}/vote/upvote`, { method: 'PUT' })
        .then(res => res.json())
        
}

const downVote = (id) => {
    if (!getCookie('token')) {
        alert('Please login to vote!')
        return;
    }
    return fetch(`/ideas/api/${id}/vote/downvote`, { method: 'PUT' })
        .then(res => res.json())
        
}

const getVoteCount = (id) => {
    return fetch(`/ideas/api/${id}/vote`, {
        method: 'GET',
    }).then(res => res.json())
        
}


