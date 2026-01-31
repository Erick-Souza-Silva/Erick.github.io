// ==========================================
// PORTFOLIO - POWERBOOK G3 INTERACTIVITY
// ==========================================

const Portfolio = {
  currentSection: "about",

  init() {
    this.setupNavigation();
    this.setupClock();
    this.setupKeyboardShortcuts();
    this.setupAccessibility();
  },

  setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-item-90s");

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.selectSection(btn));
      btn.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectSection(btn);
        }
      });
    });

    // Destacar seção ativa ao scroll
    window.addEventListener("scroll", () => this.updateActiveNavOnScroll());
  },

  selectSection(btn) {
    const sectionId = btn.dataset.section;
    const section = document.getElementById(sectionId);

    if (!section) return;

    // Atualizar navegação
    document.querySelectorAll(".nav-item-90s").forEach((b) => {
      b.classList.remove("active");
      b.removeAttribute("aria-current");
    });

    btn.classList.add("active");
    btn.setAttribute("aria-current", "page");
    this.currentSection = sectionId;

    // Scroll suave
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.focus();
  },

  updateActiveNavOnScroll() {
    const sections = ["about", "projects", "skills", "contact"];
    let activeSection = null;

    sections.forEach((id) => {
      const section = document.getElementById(id);
      const rect = section.getBoundingClientRect();

      if (rect.top <= 100) {
        activeSection = id;
      }
    });

    if (activeSection && activeSection !== this.currentSection) {
      const btn = document.querySelector(`[data-section="${activeSection}"]`);
      if (btn) {
        document.querySelectorAll(".nav-item-90s").forEach((b) => {
          b.classList.remove("active");
          b.removeAttribute("aria-current");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
        this.currentSection = activeSection;
      }
    }
  },

  setupClock() {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const display = document.querySelector(".time-display");
      if (display) display.textContent = `${hours}:${minutes}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  },

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // ⌘+1 = About, ⌘+2 = Projects, ⌘+3 = Skills, ⌘+4 = Contact
      if ((e.ctrlKey || e.metaKey) && e.key >= "1" && e.key <= "4") {
        e.preventDefault();
        const sections = ["about", "projects", "skills", "contact"];
        const index = parseInt(e.key) - 1;
        const btn = document.querySelector(
          `.nav-item-90s[data-section="${sections[index]}"]`,
        );
        if (btn) this.selectSection(btn);
      }
    });
  },

  setupAccessibility() {
    // Melhorar foco visual
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-nav");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-nav");
    });

    // Anunciar mudanças de seção
    const observerOptions = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const title = entry.target.querySelector("h2")?.textContent || "";
          const announcement = document.createElement("div");
          announcement.setAttribute("role", "status");
          announcement.setAttribute("aria-live", "polite");
          announcement.textContent = `Seção: ${title}`;
          announcement.style.display = "none";
          document.body.appendChild(announcement);
        }
      });
    }, observerOptions);

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });
  },
};

// Iniciar quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  Portfolio.init();

  // Efeito de clique suave nos botões
  document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("click", function () {
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 100);
    });
  });
});

// Função global para navegação (chamada pelos botões HTML)
function navigateToSection(sectionId) {
  const btn = document.querySelector(
    `.nav-item-90s[data-section="${sectionId}"]`,
  );
  if (btn) Portfolio.selectSection(btn);
}
