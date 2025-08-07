// ----------------------------------------------------------------
// Card stacking and flown on scroll animation
// ----------------------------------------------------------------
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

let stackCards = document.querySelectorAll(".stackCard");

let stackArea = document.querySelector(".stack-area");

function rotateStackCards() {
  let angle = 0;
  stackCards.forEach((stackCard, index) => {
    if (stackCard.classList.contains("away")) {
      stackCard.style.transform = `translateY(-120vh) rotate(-48deg)`;
    } else {
      stackCard.style.transform = ` rotate(${angle}deg)`;
      angle = angle - 10;
      stackCard.style.zIndex = stackCards.length - index;
    }
  });
}

rotateStackCards();

window.addEventListener("scroll", () => {
  let distance = window.innerHeight * 0.5;

  let topVal = stackArea.getBoundingClientRect().top;

  let index = -1 * (topVal / distance + 1);

  index = Math.floor(index);

  for (i = 0; i < stackCards.length; i++) {
    if (i <= index) {
      stackCards[i].classList.add("away");
    } else {
      stackCards[i].classList.remove("away");
    }
  }
  rotateStackCards();
});

if (window.innerWidth <= 768) {
  gsap.utils.toArray(".stackCard").forEach((card, index) => {
    gsap.from(card, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });
}


// -----------------------------------------------------------------
// Horizontal slide on scroll animation
// -----------------------------------------------------------------

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Variables
let currentCard = 0;
const totalCards = 5;
const progressDots = document.querySelectorAll(".progress-dot");
const progressText = document.querySelector(".progress-text");
const scrollProgress = document.querySelector(".scroll-progress");

// Main horizontal scroll animation
const horizontalScroll = gsap.timeline({
  scrollTrigger: {
    trigger: ".horizontal-slide",
    pin: true,
    scrub: 1,
    end: () => "+=" + window.innerWidth * (totalCards - 1),
    onUpdate: (self) => {
      // Update progress
      const progress = self.progress;
      const cardIndex = Math.min(
        Math.floor(progress * totalCards),
        totalCards - 1
      );

      if (cardIndex !== currentCard) {
        updateProgress(cardIndex);
        currentCard = cardIndex;
      }
    },
    onToggle: (self) => {
      // Show/hide progress indicator based on whether we're in the horizontal section
      if (self.isActive) {
        scrollProgress.classList.add("visible");
      } else {
        scrollProgress.classList.remove("visible");
      }
    },
  },
});

// Animate cards horizontally
horizontalScroll.to(".horizontal-cards", {
  x: () => -(window.innerWidth * (totalCards - 1)),
  ease: "none",
});

// Animate card content on scroll
gsap.utils.toArray(".card-content").forEach((content, index) => {
  gsap.set(content, { opacity: 0, y: 50 });

  gsap.to(content, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".horizontal-slide",
      start: () => `top+=${index * window.innerWidth * 0.8} center`,
      end: () => `top+=${(index + 1) * window.innerWidth * 0.8} center`,
      scrub: 1,
    },
  });
});

// Animate background shapes
gsap.utils.toArray(".card-bg-shape").forEach((shape, index) => {
  gsap.to(shape, {
    scale: 1,
    rotation: 360,
    duration: 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".horizontal-slide",
      start: () => `top+=${index * window.innerWidth * 0.7} center`,
      end: () => `top+=${(index + 1) * window.innerWidth * 0.7} center`,
      scrub: 1,
    },
  });
});

// Update progress indicator
function updateProgress(cardIndex) {
  progressDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === cardIndex);
  });
  progressText.textContent = `${cardIndex + 1} / ${totalCards}`;
}

// Click to navigate to specific cards
progressDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    const horizontalSection = document.querySelector(".horizontal-slide");
    const sectionTop = horizontalSection.offsetTop;
    const targetScroll = sectionTop + index * window.innerWidth * 0.8;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  });
});

// Initialize progress
updateProgress(0);

// Refresh ScrollTrigger on resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
