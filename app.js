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
    document.querySelector('meta[name="theme-color"]').content = dark ? "#171b19" : "#f8f9f6";
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

  // The field uses the same five-pixel smile as the public GitHub identicon.
  const canvas = document.getElementById("pixel-canvas");
  const context = canvas.getContext("2d");
  if (!context) return;
  const hero = document.querySelector(".hero");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0;
  let height = 0;
  let phase = 0;
  let frame = null;
  let visible = true;
  let lastTime = 0;
  let pointer = { x: -1000, y: -1000 };
  const smile = [[2, 0], [0, 3], [4, 3], [1, 4], [2, 4], [3, 4]];

  function draw(time = 0) {
    frame = null;
    if (!width || !height) return;
    const dark = root.dataset.theme === "dark";
    const mobile = width < 700;
    context.clearRect(0, 0, width, height);
    const cell = mobile ? 22 : 29;
    const centerSafeWidth = mobile ? width * 0.39 : 310;
    for (let x = 13; x < width; x += cell) {
      for (let y = 13; y < height - 35; y += cell) {
        const center = Math.abs(x - width / 2) < centerSafeWidth && y > 55 && y < height - 72;
        if (center) continue;
        const distance = Math.hypot(pointer.x - x, pointer.y - y);
        const near = Math.max(0, 1 - distance / 110);
        context.fillStyle = dark ? `rgba(155,174,141,${0.1 + near * 0.32})` : `rgba(98,120,75,${0.12 + near * 0.35})`;
        const size = near > 0.15 ? 2 + near * 4 : 1;
        context.fillRect(x, y, size, size);
      }
    }

    const side = mobile ? 14 : 22;
    const motifs = mobile
      ? [{ x: -25, y: 66, color: "green" }, { x: width - 50, y: height - 142, color: "blue" }]
      : [{ x: Math.max(24, width / 2 - 575), y: 125, color: "green" }, { x: width / 2 + 420, y: 252, color: "blue" }];
    motifs.forEach((motif, index) => {
      const drift = motionPreference.matches ? 0 : Math.sin(phase + index * 2) * 4;
      smile.forEach(([x, y], pixel) => {
        const opacity = mobile ? 0.13 : 0.18 + Math.sin(phase * 0.6 + pixel) * 0.015;
        const color = motif.color === "blue" ? (dark ? "137,163,216" : "118,148,206") : (dark ? "173,202,118" : "150,178,91");
        context.fillStyle = `rgba(${color},${opacity})`;
        context.fillRect(motif.x + x * (side + 3), motif.y + y * (side + 3) + drift, side, side);
      });
    });

    if (!motionPreference.matches && visible && !document.hidden) {
      if (lastTime) phase += Math.min(time - lastTime, 50) * 0.00045;
      lastTime = time;
      frame = requestAnimationFrame(draw);
    }
  }

  function scheduleDraw() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    draw(performance.now());
  }
  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    scheduleDraw();
  }
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || motionPreference.matches) return;
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { pointer = { x: -1000, y: -1000 }; });
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    scheduleDraw();
  }).observe(hero);
  document.addEventListener("themechange", scheduleDraw);
  document.addEventListener("visibilitychange", scheduleDraw);
  motionPreference.addEventListener("change", scheduleDraw);
  resize();
})();
