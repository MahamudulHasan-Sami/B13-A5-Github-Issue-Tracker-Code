let openList = [];
let closeList = [];
let allList = [];

const allIssuesSection = document.getElementById("allIssuesSection");
const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");


// toggle buttons
function toggleBtns(id) {

  allBtn.classList.remove("btn-primary");
  openBtn.classList.remove("btn-primary");
  closeBtn.classList.remove("btn-primary");

  id.classList.add("btn-primary");

  if (id === allBtn) {
    renderIssues(allList);
  }

  if (id === openBtn) {
    renderIssues(openList);
  }

  if (id === closeBtn) {
    renderIssues(closeList);
  }

  updateCount();
}


// count lists
function countList(issue) {

  allList.push(issue);

  if (issue.status === "open") {
    openList.push(issue);
  }

  if (issue.status === "closed") {
    closeList.push(issue);
  }

}


// load all issues
async function loadIssues() {

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues"
  );

  const data = await res.json();

  displayIssues(data);

}

loadIssues();


// process issues
function displayIssues(issues) {

  issues.data.forEach(issue => {
    countList(issue);
  });

  renderIssues(allList);
  updateCount();

}


// render cards
function renderIssues(list) {

  allIssuesSection.innerHTML = "";

  list.forEach(issue => {

    const labelsHTML = issue.labels
      .map(label => `<span class="badge bg-warning font-medium">${label}</span>`)
      .join("");

    const div = document.createElement("div");

    div.classList = `card bg-white shadow-sm p-5 space-y-3 border-t-3 ${issue.status === "open" ? "border-green-500" : "border-purple-500"}`;

    div.onclick = () => loadSingleIssue(issue.id);

    div.innerHTML = `
        <div class="flex justify-between items-center">
            <i class="fa-regular fa-circle-dot"></i>
            <span class="badge font-medium">${issue.priority}</span>
        </div>

        <h2 class="text-[18px] font-bold truncate">${issue.title}</h2>
        <p class="text-[14px] text-gray-600">${issue.description}</p>

        <div>
            ${labelsHTML}
        </div>

        <hr class="border border-gray-200">

        <div class="flex justify-between items-center">
            <p class="text-[12px] text-gray-500">#${issue.id} by ${issue.author}</p>
            <p class="text-[12px] text-gray-500">${new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="flex justify-between items-center">
            <p class="text-[12px] text-gray-500">Assignee: ${issue.assignee ? issue.assignee : "undefined"}</p>
            <p class="text-[12px] text-gray-500">${new Date(issue.updatedAt).toLocaleDateString()}</p>
        </div>
    `;

    allIssuesSection.appendChild(div);

  });

}


// dynamic issue count
function updateCount() {

  const countText = document.querySelector(".issues-section-left span");

  if (allBtn.classList.contains("btn-primary")) {
    countText.innerText = allList.length;
  }

  if (openBtn.classList.contains("btn-primary")) {
    countText.innerText = openList.length;
  }

  if (closeBtn.classList.contains("btn-primary")) {
    countText.innerText = closeList.length;
  }

}


// single issue modal
async function loadSingleIssue(id) {

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
  );

  const data = await res.json();

  const issue = data.data;

  showModal(issue);

}


// create modal dynamically
function showModal(issue) {

  let modal = document.getElementById("issueModal");

  if (!modal) {

    modal = document.createElement("dialog");
    modal.id = "issueModal";
    modal.className = "modal";

    document.body.appendChild(modal);

  }

  modal.innerHTML = `
  <div class="modal-box">
      <h3 class="font-bold text-lg">${issue.title}</h3>
      <p class="py-4">${issue.description}</p>

      <div class="text-sm text-gray-500 space-y-1">
          <p>Author: ${issue.author}</p>
          <p>Status: ${issue.status}</p>
          <p>Priority: ${issue.priority}</p>
      </div>

      <div class="modal-action">
          <form method="dialog">
              <button class="btn">Close</button>
          </form>
      </div>
  </div>
  `;

  modal.showModal();

}


// search issues
async function searchIssue(text) {

  if (text === "") {
    renderIssues(allList);
    return;
  }

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
  );

  const data = await res.json();

  renderIssues(data.data);

}


// attach search input listener
const searchInput = document.querySelector("input[type='search']");

searchInput.addEventListener("keyup", (e) => {
  searchIssue(e.target.value);
});


