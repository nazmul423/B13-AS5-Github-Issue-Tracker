
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

 const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => filterIssues(btn.id));
    });

};


// Data Load from Server

async function loadIssues() {
    container.innerHTML = ` <section id="spinner-container" class="hidden text-center">
            <span class="loading loading-spinner loading-xl"></span>
        </section>`;


    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await res.json();
        issues = result.data;
        displayIssues(issues);
        updateCount(issues.length);
    }

    catch (err) {
        container.innerHTML = "<p class='text-gray-500'>Unable to load issues.</p>";
        console.error(err);
    }
}


// Getting Issues Card 

function displayIssues(data) {
    container.innerHTML = "";


    data.forEach(issue => {
        const card = document.createElement("div");
        card.className = `issue-card priority-${issue.priority}`;


        // Set Piority Color

        let priorityColor = "";
        if (issue.priority === "high") priorityColor = "bg-red-100 text-red-500 px-2 py-1 rounded";
        else if (issue.priority === "medium") priorityColor = "bg-green-100 text-yellow-500 px-2 py-1 rounded";
        else priorityColor = "bg-green-100 text-green-500 px-2 py-1 rounded"



        //  Add Status icon
        const statusCircle = issue.status === "open"
            ? `<img src="./assets/Open-Status.png" alt="" class="w-5 h-5">`
            : `<img src="./assets/Closed- Status .png" alt="" class="w-5 h-5">`


        // Create the Card HTML

        card.innerHTML = `
        <div class="flex justify-between items-center">

        <div class="flex items-center">
        ${statusCircle}
        </div>


        <span class="${priorityColor}">${issue.priority.toUpperCase()}</span>

        </div>
        <h3 class="font-semibold text-lg">${issue.title}</h3>


        <p class="text-gray-500">
        ${issue.description.slice(0, 80)}...
        </p>

        
         <div class="flex gap-2 mb-4">
            <span class="flex items-center gap-1 px-4 py-1 bg-red-50 text-red-500 border border-red-100 rounded-md text-[10px] font-bold">
                <i class="fa-solid fa-bug" style="color: rgb(255, 0, 0);"></i> BUG
            </span>
            <span class="flex items-center gap-1 px-4 py-1 bg-orange-50 text-orange-500 border border-orange-100 rounded-md text-[10px] font-bold">
            <i class="fa-solid fa-circle-info" style="color: rgb(230, 99, 99);"></i> HELP WANTED
            </span>
        </div>

        <hr class="border border-gray-300 w-full">

        <div class="text-sm text-gray-400 mt-3">
        #${issue.id} by ${issue.assignee}
        </div>


        <div class="text-sm text-gray-400">
        ${issue.updatedAt}
        </div>
           `;


        // 5. Make card clickable to open modal
        card.onclick = () => openModal(issue);
        container.appendChild(card);
    });
}



// Open Modal

function openModal(issue) {
    const modal = document.getElementById("issue");
    modal.innerHTML = `<form method="dialog" class="modal-box p-0 max-w-md bg-white overflow-hidden shadow-xl border border-slate-100">
    
    <div class="p-5"> <div class="mb-4">
            <h2 class="text-xl font-bold text-slate-800 leading-tight">${issue.title}</h2>
            <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span class="bg-[#10b981] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                    Opened
                </span>
                <span>Opened</span>
                <span>By <span class="font-medium text-slate-600">${issue.assignee}</span></span>
                <span>${issue.createdAt}</span>
            </div>
        </div>

        <div class="flex gap-2 mb-4">
            <span class="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded-md text-[10px] font-bold">
                <i class="fa-solid fa-bug" style="color: rgb(255, 0, 0);"></i> BUG
            </span>
            <span class="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-500 border border-orange-100 rounded-md text-[10px] font-bold">
            <i class="fa-solid fa-circle-info" style="color: rgb(230, 99, 99);"></i> HELP
            </span>
        </div>

        <p class="text-slate-500 text-sm leading-snug mb-5 line-clamp-2">
            ${issue.description}
        </p>

        <div class="flex justify-between items-center bg-slate-50 p-3 rounded-lg mb-4">
            <div>
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-tight">Assignee</p>
                <p class="font-bold text-slate-700 text-sm">${issue.assignee}</p>
            </div>

            <div class="text-right">
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-tight mb-1">Priority</p>
                <span class="bg-red-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
        </div>

        <div class="flex justify-end">
            <button class=" btn btn-primary hover:btn-primary text-white px-6 py-2 rounded-md font-bold text-xs transition-all shadow-md active:scale-95">
                Close
            </button>
        </div>
    </div>
</form>
        `;

    modal.showModal();
}

// Filter Issue 

function filterIssues(status) {
    activeFilterBtn = status;


    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
    });

    document.getElementById(status).classList.add("btn-primary");
    document.getElementById(status).classList.remove("btn-outline");

    const filteredIssues = status === "all"
        ? issues 
        : issues.filter(issue => issue.status === status);

    displayIssues(filteredIssues);
    updateCount(filteredIssues.length);

}

// Update Count 

// function updateCount(count) {
//     const countEl = document.getElementById("issue-count");
//     if (countEl) countEl.textContent = `${count} Issues`;
// }   
