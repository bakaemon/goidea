async function editIdeas() {
     window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            selectedid = null;
        }
    }
}