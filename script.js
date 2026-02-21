// Wait for DOM to load before running scripts
document.addEventListener("DOMContentLoaded", () => {

  const icon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("theme");

  // Apply saved or system theme
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    if (icon) icon.classList.replace("fa-moon", "fa-sun");

  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
    if (icon) icon.classList.replace("fa-sun", "fa-moon");

  } else {
    // Use system preference if no saved theme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      if (icon) icon.classList.replace("fa-moon", "fa-sun");
    }
  }

  revealSections(); // trigger reveal on load
});


// DARK MODE TOGGLE
function toggleMode() {
  const icon = document.getElementById("themeIcon");

  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    if (icon) icon.classList.replace("fa-moon", "fa-sun");
  } else {
    localStorage.setItem("theme", "light");
    if (icon) icon.classList.replace("fa-sun", "fa-moon");
  }
}


//HAMBURGER MENU TOGGLE
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");

  if (navLinks) navLinks.classList.toggle("active");
  if (hamburger) hamburger.classList.toggle("active");
}


//SCROLL REVEAL FUNCTION 
window.addEventListener("scroll", revealSections);

function revealSections() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add("active");

      if (el.id === "skills") {
        animateSkills();
      }
    }
  });
}

function animateSkills() {
  const skillBars = document.querySelectorAll("#skills .bar span");

  skillBars.forEach((bar) => {
    const width = bar.dataset.width;
    if (width) {
      bar.style.width = width;
    }
  });
}


// SMOOTH SCROLL FOR NAV LINKS
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    // Only handle anchor links
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }

      // Close mobile menu if open
      const navLinks = document.getElementById("navLinks");
      const hamburger = document.getElementById("hamburger");

      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      }
    }
  });
});