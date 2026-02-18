const BACKEND_URL = "https://edu-agent-nzfp.onrender.com";

function showLogin() {
  new bootstrap.Modal(document.getElementById("loginModal")).show();
}

function scrollToApp() {
  document.getElementById("app").scrollIntoView({ behavior: "smooth" });
}

// --- COURSE FUNCTIONS ---
async function addCourse() {
  const name = document.getElementById("courseName").value.trim();
  const duration = document.getElementById("courseDuration").value.trim();
  if (!name || !duration) {
    alert("Please enter course name and duration!");
    return;
  }
  await fetch(`${BACKEND_URL}/add_course?name=${name}&duration=${duration}`);
  document.getElementById("courseName").value = "";
  document.getElementById("courseDuration").value = "";
  loadCourses();
}

async function loadCourses() {
  const res = await fetch(`${BACKEND_URL}/courses`);
  const data = await res.json();
  const courseList = document.getElementById("courseList");
  courseList.innerHTML = data.map(
    c => `<li class="list-group-item bg-transparent text-light">
            <i class="bi bi-book"></i> ${c.name} 
            <span class="text-info">(${c.duration} days)</span>
          </li>`
  ).join("");
}

// --- STUDENT FUNCTIONS ---
async function addStudent() {
  const name = document.getElementById("studentName").value.trim();
  const progress = document.getElementById("studentProgress").value.trim();
  if (!name || !progress) {
    alert("Please enter student name and progress!");
    return;
  }
  await fetch(`${BACKEND_URL}/add_student?name=${name}&progress=${progress}`);
  document.getElementById("studentName").value = "";
  document.getElementById("studentProgress").value = "";
  loadStudents();
}

async function loadStudents() {
  const res = await fetch(`${BACKEND_URL}/students`);
  const data = await res.json();
  const studentList = document.getElementById("studentList");
  studentList.innerHTML = data.map(
    s => `<li class="list-group-item bg-transparent text-light">
            <i class="bi bi-person-circle"></i> ${s.name}
            <div class="progress mt-2" style="height: 10px;">
              <div class="progress-bar bg-info" role="progressbar" 
                   style="width: ${s.progress}%;" 
                   aria-valuenow="${s.progress}" aria-valuemin="0" aria-valuemax="100">
              </div>
            </div>
            <small class="text-warning">${s.progress}%</small>
          </li>`
  ).join("");
  renderChart(data);
}

// --- CHART ---
let chart;
function renderChart(data) {
  if (chart) chart.destroy();

  // Create gradient for bars
  const ctx = document.getElementById("progressChart").getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#00c6ff");
  gradient.addColorStop(1, "#0072ff");

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(s => s.name),
      datasets: [{
        label: "Progress %",
        data: data.map(s => s.progress),
        backgroundColor: gradient
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#fff" } }
      },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } }
      }
    }
  });
}

// --- SEARCH FILTER ---
function filterLists() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const courseItems = document.querySelectorAll("#courseList li");
  const studentItems = document.querySelectorAll("#studentList li");

  courseItems.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
  });
  studentItems.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
  });
}

// --- INITIAL LOAD ---
loadCourses();
loadStudents();
