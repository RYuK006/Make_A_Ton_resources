// dashboard.js

// ==================== AUTH GUARD ====================
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// ==================== GLOBAL DATA & CHART ====================
let vehicleData = {
    car: 0,
    bike: 0,
    bus: 0,
    ambulance: 0
};

const ctx = document.getElementById("trafficChart").getContext("2d");
const trafficChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Cars", "Bikes", "Buses", "Ambulances"],
        datasets: [{
            label: "Vehicles Detected",
            data: [0, 0, 0, 0],
            backgroundColor: ["#3498db", "#2ecc71", "#e67e22", "#e74c3c"]
        }]
    },
    options: {
        responsive: true,
        animation: false
    }
});

// ==================== MULTI‑JUNCTION SUPPORT ====================
let junctionList = [];

// Update the dashboard cards and chart with data from one junction
function updateCardsAndChart(data) {
    // data contains: car, bike, bus, ambulance, directions, emergency
    ['car', 'bike', 'bus', 'ambulance'].forEach(type => {
        const el = document.getElementById(type + 'Count');
        const target = data[type];
        if (el && el.textContent != target) {
            el.textContent = target;
            el.classList.add('flash');
            setTimeout(() => el.classList.remove('flash'), 350);
        }
    });
    trafficChart.data.datasets[0].data = [
        data.car,
        data.bike,
        data.bus,
        data.ambulance
    ];
    trafficChart.update();
    // Optional: update direction signals panel here if you have one
}

// Fetch live data for the currently selected junction
async function fetchTrafficData() {
    const junctionSelect = document.getElementById('junctionSelect');
    if (!junctionSelect) return; // guard
    const junctionId = junctionSelect.value;
    const url = junctionId === 'all' ? '/data' : `/data?junction_id=${junctionId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (junctionId === 'all') {
            // data is an object with all junctions – pick the first one for simplicity
            const firstJid = Object.keys(data)[0];
            if (firstJid) {
                updateCardsAndChart(data[firstJid]);
            }
        } else {
            updateCardsAndChart(data);
        }
    } catch (error) {
        console.log("Waiting for backend...", error);
    }
}

// Load available junctions from the server and populate the dropdown
async function loadJunctions() {
    try {
        const resp = await fetch('/junctions');
        junctionList = await resp.json();
        const select = document.getElementById('junctionSelect');
        // Preserve the "All Junctions" option
        select.innerHTML = '<option value="all">◎ All Junctions</option>';
        junctionList.forEach(jid => {
            const option = document.createElement('option');
            option.value = jid;
            option.textContent = `Junction ${jid}`;
            select.appendChild(option);
        });
    } catch (err) {
        console.log('Could not load junctions', err);
    }
}

// ==================== START THE REAL‑TIME LOOP ====================
// First load the junction list, then fetch immediately and start polling
loadJunctions().then(() => {
    fetchTrafficData();                       // initial fetch
    setInterval(fetchTrafficData, 1000);      // then every second
});
// Add this inside your dashboard.js, after loadJunctions()

function updateCameraFeed(junctionId) {
    const img = document.getElementById('junctionCameraFeed');
    if (junctionId === 'all') {
        // Optionally show a default or first junction
        const firstJid = junctionList[0];
        if (firstJid) {
            img.src = `/video_feed/${firstJid}`;
            document.getElementById('cameraJunctionTag').textContent = `Junction ${firstJid}`;
        }
    } else {
        img.src = `/video_feed/${junctionId}`;
        document.getElementById('cameraJunctionTag').textContent = `Junction ${junctionId}`;
    }
}

// Modify fetchTrafficData to also update camera when junction changes
async function fetchTrafficData() {
    const junctionSelect = document.getElementById('junctionSelect');
    if (!junctionSelect) return;
    const junctionId = junctionSelect.value;
    const url = junctionId === 'all' ? '/data' : `/data?junction_id=${junctionId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (junctionId === 'all') {
            const firstJid = Object.keys(data)[0];
            if (firstJid) {
                updateCardsAndChart(data[firstJid]);
                updateCameraFeed(firstJid);  // show first junction's cameras
            }
        } else {
            updateCardsAndChart(data);
            updateCameraFeed(junctionId);
        }
    } catch (error) {
        console.log("Waiting for backend...", error);
    }
}

// Also call updateCameraFeed when dropdown changes manually (onchange event)
document.getElementById('junctionSelect').addEventListener('change', function() {
    const jid = this.value;
    if (jid !== 'all') {
        updateCameraFeed(jid);
    } else {
        // For 'all', we already fetch data and then updateCameraFeed with first
        // But we can just let fetchTrafficData handle it.
    }
});
// Update camera feed when junction changes
function updateCameraFeed(junctionId) {
    const img = document.getElementById('junctionCameraFeed');
    if (!img) return;
    // If "all" is selected, pick the first available junction
    if (junctionId === 'all' && junctionList.length > 0) {
        img.src = `/video_feed/${junctionList[0]}`;
        document.getElementById('cameraJunctionTag').textContent = `Junction ${junctionList[0]}`;
    } else if (junctionId !== 'all') {
        img.src = `/video_feed/${junctionId}`;
        document.getElementById('cameraJunctionTag').textContent = `Junction ${junctionId}`;
    }
}

// Modify your fetchTrafficData to also update the camera
async function fetchTrafficData() {
    const junctionSelect = document.getElementById('junctionSelect');
    if (!junctionSelect) return;
    const junctionId = junctionSelect.value;
    const url = junctionId === 'all' ? '/data' : `/data?junction_id=${junctionId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (junctionId === 'all') {
            const firstJid = Object.keys(data)[0];
            if (firstJid) {
                updateCardsAndChart(data[firstJid]);
                updateCameraFeed(firstJid);  // show first junction's cameras
            }
        } else {
            updateCardsAndChart(data);
            updateCameraFeed(junctionId);
        }
    } catch (error) {
        console.log("Waiting for backend...", error);
    }
}

// Also update camera when dropdown changes manually
document.getElementById('junctionSelect').addEventListener('change', function() {
    const jid = this.value;
    if (jid !== 'all') {
        updateCameraFeed(jid);
    } else {
        // For 'all', we'll rely on fetchTrafficData to pick first
        fetchTrafficData(); // triggers updateCameraFeed with first
    }
});
// ==================== LOGOUT ====================
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}