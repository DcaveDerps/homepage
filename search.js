function search() {

    let searchText = document.getElementById("searchBar").value.trim();
    let formattedSearch = searchText.replace(/\s/g, "+");

    window.location.href = "https://duckduckgo.com/?q=" + formattedSearch;

}