// Placeholder data (replace with actual data from your backend)
const placementData = {
    engineering: {
        name: "School of Engineering",
        stats: {
            2021: { eligible: 300, placed: 250 },
            2022: { eligible: 320, placed: 280 },
            2023: { eligible: 350, placed: 310 }
        },
        recruiters: ["TCS", "Infosys", "Wipro", "CTS"]
    },
    "computer-applications": {
        name: "Department of Computer Applications",
        stats: {
            2021: { eligible: 100, placed: 85 },
            2022: { eligible: 110, placed: 95 },
            2023: { eligible: 120, placed: 105 }
        },
        recruiters: ["Amazon", "Microsoft", "IBM", "Oracle"]
    },
    "bio-technology": {
        name: "Department of Bio-Technology",
        stats: {
            2021: { eligible: 80, placed: 60 },
            2022: { eligible: 85, placed: 70 },
            2023: { eligible: 90, placed: 75 }
        },
        recruiters: ["Biocon", "Novozymes", "Cipla", "Dr. Reddy's"]
    },
    "ship-technology": {
        name: "Department of Ship Technology",
        stats: {
            2021: { eligible: 60, placed: 45 },
            2022: { eligible: 65, placed: 50 },
            2023: { eligible: 70, placed: 55 }
        },
        recruiters: ["Cochin Shipyard", "L&T Shipbuilding", "ABG Shipyard", "Mazagon Dock"]
    },
    instrumentation: {
        name: "Department of Instrumentation",
        stats: {
            2021: { eligible: 70, placed: 55 },
            2022: { eligible: 75, placed: 60 },
            2023: { eligible: 80, placed: 65 }
        },
        recruiters: ["Siemens", "ABB", "Honeywell", "Yokogawa"]
    },
    "legal-studies": {
        name: "School of Legal Studies",
        stats: {
            2021: { eligible: 90, placed: 70 },
            2022: { eligible: 95, placed: 75 },
            2023: { eligible: 100, placed: 80 }
        },
        recruiters: ["Kochhar & Co.", "Luthra & Luthra", "AZB & Partners", "Trilegal"]
    },
    "business-studies": {
        name: "Center for Business Studies",
        stats: {
            2021: { eligible: 110, placed: 90 },
            2022: { eligible: 120, placed: 100 },
            2023: { eligible: 130, placed: 110 }
        },
        recruiters: ["Deloitte", "EY", "KPMG", "PwC"]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const dept = params.get('dept');
    const deptData = placementData[dept];

    if (deptData) {
        document.querySelector('.department-header h2').textContent = deptData.name + " Placement Statistics";
        renderBarChart(deptData.stats);
        renderPieChart(deptData.stats[2023]); // Show pie chart for the latest year
        displayRecruiters(deptData.recruiters);
    } else {
        document.querySelector('main').innerHTML = "<p>Department data not found.</p>";
    }
});

function renderBarChart(stats) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats),
            datasets: [
                {
                    label: 'Eligible Students',
                    data: Object.values(stats).map(year => year.eligible),
                    backgroundColor: 'rgba(52, 152, 219, 0.8)'
                },
                {
                    label: 'Placed Students',
                    data: Object.values(stats).map(year => year.placed),
                    backgroundColor: 'rgba(46, 204, 113, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderPieChart(latestYearStats) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Placed', 'Not Placed'],
            datasets: [{
                data: [latestYearStats.placed, latestYearStats.eligible - latestYearStats.placed],
                backgroundColor: ['rgba(46, 204, 113, 0.8)', 'rgba(231, 76, 60, 0.8)']
            }]
        },
        options: {
            responsive: true
        }
    });
}

function displayRecruiters(recruiters) {
    const container = document.querySelector('.recruiter-logos');
    recruiters.forEach(recruiter => {
        const img = document.createElement('img');
        img.src = `images/${recruiter.toLowerCase().replace(/\s+/g, '-')}.png`; // Ensure you have these logo images
        img.alt = recruiter;
        img.className = 'recruiter-logo';
        container.appendChild(img);
    });
}