// Backend base URL
const BASE_URL = "https://edu-agent-1-dkgp.onrender.com";

// --- Courses ---
function addCourse() {
  const name = document.getElementById("courseName").value;
  const duration = document.getElementById("courseDuration").value;
  if (!name || !duration) return alert("Enter course details!");

  const li = document.createElement("li");
  li.className = "list-group-item bg-transparent text-white";
  li.textContent = `${name} - ${duration} days`;
  document.getElementById("courseList").appendChild(li);

  document.getElementById("courseName").value = "";
  document.getElementById("courseDuration").value = "";
}

// --- Students ---
let studentData = [];
function addStudent() {
  const name = document.getElementById("studentName").value;
  const progress = document.getElementById("studentProgress").value;
  if (!name || !progress) return alert("Enter student details!");

  studentData.push({ name, progress: parseInt(progress) });

  const li = document.createElement("li");
  li.className = "list-group-item bg-transparent text-white";
  li.textContent = `${name} - ${progress}% progress`;
  document.getElementById("studentList").appendChild(li);

  updateChart();
  document.getElementById("studentName").value = "";
  document.getElementById("studentProgress").value = "";
}

// --- Chart.js ---
let chart;
function updateChart() {
  const ctx = document.getElementById("progressChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: studentData.map(s => s.name),
      datasets: [{
        label: "Progress (%)",
        data: studentData.map(s => s.progress),
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }]
    }
  });
}

// --- AI Assistant ---
async function askAI() {
  const query = document.getElementById("chatInput").value;
  if (!query) return;

  addMessage(query, "user");
  document.getElementById("chatInput").value = "";

  try {
    const res = await fetch(`${BASE_URL}/ask_ai?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    addMessage(data.answer, "ai");
  } catch (err) {
    addMessage("Error contacting AI assistant.", "ai");
  }
}

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `chat-message chat-${sender}`;
  div.textContent = text;
  document.getElementById("chatBox").appendChild(div);
  document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
}

// --- Recommendations ---
async function getRecommendations(name, progress) {
  try {
    const res = await fetch(`${BASE_URL}/recommend_courses?student_name=${encodeURIComponent(name)}&progress=${progress}`);
    const data = await res.json();
    alert(`Recommendations for ${name}:\n${data.recommendations}`);
  } catch (err) {
    alert("Error fetching recommendations.");
  }
}

// --- Helpers ---
function scrollToApp() {
  document.getElementById("app").scrollIntoView({ behavior: "smooth" });
}
function showLogin() {
  alert("Login feature coming soon!");
}
