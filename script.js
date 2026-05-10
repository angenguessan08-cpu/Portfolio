const header = document.querySelector("[data-header]");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const countItems = document.querySelectorAll("[data-count]");
const tiltCards = document.querySelectorAll(".tilt-card");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Keeps the floating header visually connected to scroll position.
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function setActiveLink() {
  const scrollPosition = window.scrollY + window.innerHeight * 0.35;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPosition >= top && scrollPosition < bottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`);
      });
    }
  });
}

// KPI counter animation for the impact section.
function animateCount(element) {
  const target = Number(element.dataset.count);
  const duration = 1100;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}+`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
);

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("visible"));
  countItems.forEach((item) => {
    item.textContent = `${item.dataset.count}+`;
  });
} else {
  revealItems.forEach((item) => revealObserver.observe(item));
  countItems.forEach((item) => countObserver.observe(item));
}

// Subtle 3D portrait movement on desktop pointer devices.
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (prefersReducedMotion) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 10;
    const rotateX = (0.5 - y / rect.height) * 10;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

// Magnetic buttons add a premium tactile feel without blocking accessibility.
document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    if (prefersReducedMotion) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

window.addEventListener("scroll", () => {
  updateHeader();
  setActiveLink();
});

updateHeader();
setActiveLink();
