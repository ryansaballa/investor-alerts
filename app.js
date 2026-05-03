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

    // loads the  existing alerts
    const alerts = getAlerts()

    // adds alerts
    alerts.push(newAlert)

    // saves
    saveAlerts(alerts)

    // reset form
    form.reset()

    loadAdminAlerts()
  })
}

// admin dashboard interaction

function loadAdminAlerts() {
  const container = document.getElementById("adminContainer")
  const alerts = getAlerts()

  // admin only sees 'pending' alerts
  const pendingAlerts = alerts.filter((a) => a.status === "pending")

  container.innerHTML = ""

  if (pendingAlerts.length === 0) {
    container.innerHTML = "<p>No alerts available.</p>"
    return
  }

  pendingAlerts.forEach((alert) => {
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

// adds interactivity when user clicks on the approve button, but only updates the array in the local storage from 'pending' to 'approved'

function approveAlert(id) {
  const alerts = getAlerts()

  const updatedAlerts = alerts.map((alert) => {
    // displays each alert
    if (alert.id === Number(id)) {
      // finds the alert that the user clicked
      return {
        ...alert,
        status: "approved",
        publishedAt: new Date().toISOString(),
      }
    }
    // displays the approved alert
    return alert
  })

  saveAlerts(updatedAlerts)
  loadAdminAlerts()
}

// rending alerts - rejected (optional)

function rejectAlert(id) {
  const alerts = getAlerts()

  const updatedAlerts = alerts.map((alert) => {
    if (alert.id === Number(id)) {
      return {
        ...alert,
        status: "rejected",
      }
    }
    return alert
  })

  saveAlerts(updatedAlerts)
  loadAdminAlerts()
}

// landing page rendering

function loadPublicAlerts() {
  const container = document.getElementById("alert-container")
  const alerts = getAlerts()
  const approved = alerts.filter((a) => a.status === "approved")
  container.innerHTML = ""

  approved.forEach((alert) => {
    const div = document.createElement("div")
    div.innerHTML = `
		<h3>${alert.title}</h3>
		<p>${formatDate(alert.publishedAt)}</p>
    <p>${alert.summary}</p>
    <a href="${alert.link}" target="_blank">Source</a>
		`
    container.appendChild(div)
  })
}

// need update the admin page and have the approved alerts pop in the main landing page

function resetAlerts() {
  localStorage.removeItem("alerts")
  loadAdminAlerts() // refresh UI
}

// formats the date as Month - Day - Year
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// expiration for alerts

