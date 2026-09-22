(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const darkPreference = window.matchMedia("(prefers-color-scheme: dark)");
  let explicitTheme = false;
  try {
    explicitTheme = ["light", "dark"].includes(localStorage.getItem("mcyh234-theme"));
  } catch {}

  function updateThemeControls() {
    const dark = root.dataset.theme === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
    themeButton.dataset.tooltip = dark ? "浅色模式" : "深色模式";
    document.querySelector('meta[name="theme-color"]').content = dark ? "#151716" : "#f3f4f0";
    document.dispatchEvent(new Event("themechange"));
  }

  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    explicitTheme = true;
    try {
      localStorage.setItem("mcyh234-theme", root.dataset.theme);
    } catch {}
    updateThemeControls();
  });
  darkPreference.addEventListener("change", (event) => {
    if (!explicitTheme) {
      root.dataset.theme = event.matches ? "dark" : "light";
      updateThemeControls();
    }
  });
  updateThemeControls();

  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  function setMenu(open, returnFocus = false) {
    mobileNav.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener("click", () => setMenu(mobileNav.hidden));
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenu(false);
      const section = document.querySelector(link.hash);
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
      section.addEventListener("blur", () => section.removeAttribute("tabindex"), { once: true });
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) setMenu(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!mobileNav.hidden && !event.target.closest(".site-header")) setMenu(false);
  });
  window.matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  const cards = [...document.querySelectorAll(".project-card")];
  const filters = [...document.querySelectorAll("[data-filter]")];
  const search = document.getElementById("project-search");
  const clearSearch = document.getElementById("search-clear");
  const emptyState = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  const exploreLink = document.getElementById("explore-link");
  let activeFilter = "all";

  function filterProjects() {
    document.dispatchEvent(new Event("projects:before-filter"));
    const query = search.value.trim().toLocaleLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const haystack = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase();
      const matchesQuery = terms.every((term) => haystack.includes(term));
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) visible++;
    });
    filters.forEach((button) => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    clearSearch.hidden = search.value.length === 0;
    emptyState.hidden = visible !== 0;
    exploreLink.hidden = activeFilter !== "all" || query.length !== 0;
    resultCount.textContent = activeFilter === "all" && query === "" ? `${cards.length} 个公开项目` : `找到 ${visible} 个项目`;
    document.dispatchEvent(new Event("projects:filtered"));
  }

  filters.forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterProjects();
  }));
  search.addEventListener("input", filterProjects);
  clearSearch.addEventListener("click", () => {
    search.value = "";
    filterProjects();
    search.focus();
  });
  document.getElementById("reset-filters").addEventListener("click", () => {
    activeFilter = "all";
    search.value = "";
    filterProjects();
    filters[0].focus();
  });
  document.getElementById("project-toolbar").hidden = false;
  filterProjects();

  let toastTimeout;
  function toast(message) {
    const element = document.getElementById("toast");
    clearTimeout(toastTimeout);
    element.querySelector("span").textContent = message;
    element.hidden = false;
    toastTimeout = setTimeout(() => { element.hidden = true; }, 3200);
  }

  document.getElementById("copy-username").addEventListener("click", async () => {
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText("mcyh234");
        copied = true;
      } catch {}
    }
    if (!copied) {
      const activeElement = document.activeElement;
      const temporary = document.createElement("textarea");
      temporary.value = "mcyh234";
      temporary.className = "sr-only";
      temporary.setAttribute("readonly", "");
      temporary.setAttribute("aria-label", "GitHub 用户名");
      document.body.appendChild(temporary);
      temporary.select();
      try {
        copied = document.execCommand("copy");
      } catch {}
      temporary.remove();
      activeElement?.focus({ preventScroll: true });
    }
    toast(copied ? "已复制 GitHub 用户名" : "未能访问剪贴板，用户名是 mcyh234");
  });

  document.getElementById("copyright-year").textContent = new Date().getFullYear();
  const sections = [...document.querySelectorAll("main > section[id]")];
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  let scrollFrame;
  function updateNavigation() {
    const extent = document.documentElement.scrollHeight - innerHeight;
    document.querySelector(".reading-progress").style.transform = `scaleX(${extent > 0 ? Math.min(1, scrollY / extent) : 0})`;
    document.querySelector(".site-header").classList.toggle("is-scrolled", scrollY > 40);
    const marker = Math.min(180, window.innerHeight * 0.25);
    let current = "home";
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section.id;
    });
    if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 3) current = "contact";
    navLinks.forEach((link) => {
      const selected = link.dataset.nav === current;
      link.classList.toggle("is-current", selected);
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scrollFrame = null;
  }
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation);
  }, { passive: true });
  updateNavigation();
})();
