// helps feed the data

// retrieves data from local storage labeled as 'alerts'
function getAlerts() {
    return JSON.parse(localStorage.getItem("alerts")) || [];
}

// saves alerts by storing data in local storage
function saveAlerts(alerts) {
    localStorage.setItem("alerts", JSON.stringify(alerts));
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
    };
}

// event handlers that utilizes the object
function setupForm() {
    const form = document.getElementById("alertForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); /* prevent the broswer normally refreshes or goes to another page */

        // newAlert stores data from the createAlertFromForm function
        const newAlert = createAlertFromForm();

        // loads the  existing alerts
        const alerts = getAlerts();

        // adds alerts
        alerts.push(newAlert);

        // saves
        saveAlerts(alerts);

        // reset form
        form.reset();

        loadAdminAlerts();
    });
}

// adds interactivity when user clicks on the approve button, but only updates the array in the local storage from 'pending' to 'approved'

function approveAlert(id) {
    const alerts = getAlerts();

    const updatedAlerts = alerts.map((alert) => {
        // displays each alert
        if (alert.id === Number(id)) {
            // finds the alert that the user clicked
            return {
                ...alert,
                status: "approved",
                publishedAt: formatDate(alert.createdAt),
            };
        }
        // displays the approved alert
        return alert;
    });

    saveAlerts(updatedAlerts);
    loadAdminAlerts();
}

// admin dashboard interaction

function loadAdminAlerts() {
    const container = document.getElementById("adminContainer");
    const overdueContainer = document.getElementById("adminContainerExp");
    const alerts = getAlerts();

    // admin only sees 'pending' alerts and filters non-expired alerts and sorted by risk level
    const pendingAlerts = alerts.filter((a) => a.status === "pending" && !expiredAlerts(a.createdAt)).sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]);

    // admin sees expired alerts
    const overdueAlerts = alerts
        .filter((a) => a.status === "approved" && a.createdAt && expiredAlerts(a.createdAt))
        .sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]);

    container.innerHTML = "";
    overdueContainer.innerHTML = "";

    if (pendingAlerts.length === 0) {
        container.innerHTML = '<div class="alertCard"><p>No alerts available.</p></div>';
    }

    pendingAlerts.forEach((alert) => {
        const div = document.createElement("div");
        div.classList.add("alertCard");

        div.innerHTML = `
    <h3>${alert.title}</h3>

  <p><strong>Date Created:</strong> ${formatDate(alert.createdAt)}</p>
  <p><strong>Status:</strong> ${alert.status}</p>
  ${alert.publishedAt ? `<p><strong>Published:</strong> ${alert.publishedAt}</p>` : ""}

  <p><strong>Risk Level:</strong> ${alert.riskLevel}</p>

  <p><strong>Summary:</strong><br>${alert.summary}</p>

  <p>
    Related Link: <a href="${alert.link}" target="_blank">${alert.title}</a>
  </p>
  ${
      alert.status === "pending"
          ? `
      <button onclick="approveAlert(${alert.id})">Approve</button>
      <button onclick="rejectAlert(${alert.id})">Reject</button>
    `
          : ""
  }
    
    `;
        container.appendChild(div);
    });

    overdueAlerts.forEach((alert) => {
        const div = document.createElement("div");
        div.classList.add("alertCard");

        div.innerHTML = `
    <h3>${alert.title}</h3>

  <p><strong>Date Created:</strong> ${formatDate(alert.createdAt)}</p>
  <p><strong>Status:</strong> ${alert.status}</p>
  ${alert.publishedAt ? `<p><strong>Published:</strong> ${alert.publishedAt}</p>` : ""}

  <p><strong>Risk Level:</strong> ${alert.riskLevel}</p>

  <p><strong>Summary:</strong><br>${alert.summary}</p>

  <p>
    Related Link: <a href="${alert.link}" target="_blank">${alert.title}</a>
  </p>
  ${
      alert.status === "pending"
          ? `
      <button onclick="approveAlert(${alert.id})">Approve</button>
      <button onclick="rejectAlert(${alert.id})">Reject</button>
    `
          : ""
  }
    
    `;
        overdueContainer.appendChild(div);
    });
}

// rendering alerts - rejected (optional)

function rejectAlert(id) {
    const alerts = getAlerts();

    const updatedAlerts = alerts.map((alert) => {
        if (alert.id === Number(id)) {
            return {
                ...alert,
                status: "rejected",
            };
        }
        return alert;
    });

    saveAlerts(updatedAlerts);
    loadAdminAlerts();
}

// landing page rendering

function loadPublicAlerts() {
    const container = document.getElementById("alertContainer");

    const alerts = getAlerts();

    // filters the list of rendered alerts from newest to oldest
    const approved = alerts.filter((a) => a.status === "approved").sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    container.innerHTML = "";

    approved.forEach((alert) => {
        const div = document.createElement("div");
        div.classList.add("alertCard");
        div.innerHTML = `
		<p>${formatDate(alert.publishedAt)}</p>
    <h3>${alert.title}</h3>
		<p>${alert.summary}</p>
    <a href="${alert.link}" target="_blank">Related Link</a>
		`;
        container.appendChild(div);
    });
}

// need update the admin page and have the approved alerts pop in the main landing page

function resetAlerts() {
    localStorage.removeItem("alerts");
    loadAdminAlerts(); // refresh UI
}

// expiration for alerts of 2 days passed created Date

function expiredAlerts(dateString) {
    const today = new Date();
    const createdDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    createdDate.setHours(0, 0, 0, 0);

    const diffTime = today - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // converts difference in diffDays

    return diffDays > 2;
}

// deletion function for expired alerts
function deleteExpiredAlerts() {
    const alerts = getAlerts();
    const updatedAlerts = alerts.filter((alert) => {
        return !expiredAlerts(alert.createdAt); // keeps not expired alerts
    });

    saveAlerts(updatedAlerts);

    loadAdminAlerts();
    loadPublicAlerts();
}

// formats the date as Month - Day - Year
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// formats alerts by risk Level

const riskOrder = {
    high: 3,
    medium: 2,
    low: 1,
};
