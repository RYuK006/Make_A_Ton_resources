// Select necessary DOM elements
const main = document.querySelector("main");
const toggle = document.querySelectorAll(".toggle");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
const textGroups = document.querySelectorAll(".text-group h2");

// Toggle between Sign-in and Sign-up forms
toggle.forEach((btn) =>
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  })
);

// Function to move text slider
const moveTextSlider = (index) => {
  textGroups.forEach((text, i) => {
    text.style.transform = `translateY(${100 * (i - index)}%)`;
  });
};

// Function to switch images in the carousel
const moveImageSlider = (index) => {
  images.forEach((img, i) => {
    img.classList.remove("show");
    if (i === index) {
      img.classList.add("show");
    }
  });
};

// Function to handle bullets (navigation dots)
const handleCarouselNavigation = (index) => {
  bullets.forEach((bullet) => bullet.classList.remove("active"));
  bullets[index].classList.add("active");

  // Update text and image sliders
  moveTextSlider(index);
  moveImageSlider(index);
};

// Add event listeners to each bullet for manual carousel control
bullets.forEach((bullet, i) => {
  bullet.addEventListener("click", () => {
    handleCarouselNavigation(i);
  });
});

// Auto slider for carousel (optional)
let currentIndex = 0;
const autoSlide = () => {
  currentIndex = (currentIndex + 1) % bullets.length;
  handleCarouselNavigation(currentIndex);
};

// Optional: Set an interval for the auto carousel (uncomment if needed)
// setInterval(autoSlide, 5000); // Change slide every 5 seconds
