// helps feed the data

// retrieves data from local storage labeled as 'alerts'
function getAlerts() {
  return JSON.parse(localStorage.getItem("alerts")) || []
}

// saves alerts by storing data in local storage
function saveAlerts(alerts) {
  localStorage.setItem("alerts", JSON.stringify(alerts))
}

// alerts are all stored in an object with key-value pairings
function createAlertFromForm() {
  return {
    id: Date.now(),
    title: document.getElementById("title").value,
    summary: document.getElementById("summary").value,
    description: document.getElementById("description").value,
    link: document.getElementById("link").value,
    riskLevel: document.getElementById("risk").value,
    createdAt: document.getElementById("date").value,
    status: "pending",
    publishedAt: null,
  }
}

// event handlers that utilizes the object
function setupForm() {
  const form = document.getElementById("alertForm")

  form.addEventListener("submit", function (e) {
    e.preventDefault() /* prevent the broswer normally refreshes or goes to another page */

    // newAlert stores data from the createAlertFromForm function
    const newAlert = createAlertFromForm()

    // get existing alerts
    const alerts = getAlerts()

    // adds alerts
    alerts.push(newAlert)

    // saves
    saveAlerts(alerts)

    // reset form
    form.reset()
  })
}

// admin dashboard interaction

function loadAdminAlerts() {
  const container = document.getElementById("adminContainer")
  const alerts = getAlerts()

  container.innerHTML = ""

  if (alerts.length === 0) {
    container.innerHTML = "<p>No alerts available.</p>"
    return
  }

  alerts.forEach((alert) => {
    const div = document.createElement("div")
    div.classList.add("alert-card")

    div.innerHTML = `
    <h3>${alert.title}</h3>

  <p><strong>Date Created:</strong> ${alert.createdAt}</p>
  <p><strong>Status:</strong> ${alert.status}</p>
  ${
    alert.publishedAt
      ? `<p><strong>Published:</strong> ${new Date(alert.publishedAt).toLocaleString()}</p>`
      : ""
  }

  <p><strong>Risk Level:</strong> ${alert.riskLevel}</p>

  <p><strong>Summary:</strong><br>${alert.summary}</p>
  <p><strong>Description:</strong><br>${alert.description}</p>

  <p>
    <a href="${alert.link}" target="_blank">View Source</a>
  </p>
  ${
    alert.status === "pending"
      ? `
      <button onclick="approveAlert(${alert.id})">Approve</button>
      <button onclick="rejectAlert(${alert.id})">Reject</button>
    `
      : ""
  }
    
    `
    container.appendChild(div)
  })
}

// rendering alerts
