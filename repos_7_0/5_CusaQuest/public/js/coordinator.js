// Function to open modal with company details
document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const companyImage = card.querySelector('.company-image').src;
        const jobRole = card.dataset.role;
        const packageOffered = card.dataset.package;
        const interviewDate = card.dataset.interview;

        // Update modal content
        document.getElementById('modalImage').src = companyImage;
        document.getElementById('jobRole').textContent = `Job Role: ${jobRole}`;
        document.getElementById('packageOffered').textContent = `Package: ${packageOffered}`;
        document.getElementById('interviewDate').textContent = `Interview Date: ${interviewDate}`;

        // Show modal
        document.getElementById('modal').style.display = 'block';
    });
});

// Function to close modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}