
const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let issues = [];
let activeFilterBtn = "all";


const container = document.getElementById("issues-container");
const searchInput = document.getElementById("search-input");


window.onload = function () {
    loadIssues();

    // Search Functionality 
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const query = event.target.value.toLowerCase();
            const filtered = issues.filter(issue =>
                issue.title.toLowerCase().includes(query) ||
                issue.description.toLowerCase().includes(query)
            );

            displayIssues(filtered);
            updateCount(filtered.length);

        });
    }

   
