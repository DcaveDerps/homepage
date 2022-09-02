function search() {
    console.log("you searched");
    let searchText = document.getElementById("searchBar").value.trim();
    //console.log("search text:" + searchText);
    let formattedSearch = searchText.replace(/\s/g, "+");
    //console.log("formatted search terms: " +  formattedSearch);

    window.location.href = "https://duckduckgo.com/?q=" + formattedSearch;

    return false;

}