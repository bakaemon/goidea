
const upVote = (id) => {
    fetch(`/ideas/api/${id}/vote/upvote`, { method: 'PUT' })
        .then(res => res.json())
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
        }
        )
}

const downVote = (id) => {
    fetch(`/ideas/api/${id}/vote/downvote`, { method: 'PUT' })
        .then(res => res.json())
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
}

const getVoteCount = (id) => {
    return fetch(`/ideas/api/${id}/vote`, {
        method: 'GET',
    }).then(res => res.json())
        
}


