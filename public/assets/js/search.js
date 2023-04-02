document.addEventListener("load", () => {
    document.getElementById("search").addEventListener("click", () => {
        var searchInput = document.getElementById("search-input").value;
        var ideaSearch = idea.filter(value => {
            return value.title.toUpperCase().include(searchInput.toUpperCase())
        });
        
        loadIdeaTable(ideaSearch);
    });
});