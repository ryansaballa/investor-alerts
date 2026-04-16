// helps feed the data

// retrieves data from local storage labeled as 'alerts'
function getAlerts() {
  return JSON.parse(localStorage.getItem("alerts")) || []
}

// saves alerts by storing data in local storage
function saveAlerts(alerts) {
  localStorage.setItem("alerts", JSON.stringify(alerts))
}

function createAlertFromForm() {
  return {}
}

// event handlers that utilizes the object
function setupForm() {
  const form = document.getElementById("alertForm")

  form.addEventListener("submit", function (e) {
    e.preventDefault() /* prevent the broswer normally refreshes or goes to another page */

    // alerts are all stored in an object with key-value pairings
    const newAlert = {
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

// rendering alerts
