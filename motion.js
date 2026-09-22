(() => {
  "use strict";
  const root = document.documentElement;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const control = document.getElementById("motion-toggle");
  let userPaused = false;
  try { userPaused = localStorage.getItem("mcyh234-motion") === "paused"; } catch {}
  const animations = new Set();
  const pending = new Map();

  function isPaused() { return userPaused || preference.matches; }
  function animate(element, frames, options) {
    if (isPaused() || document.hidden || !element.animate) return null;
    const previous = pending.get(element);
    if (previous) previous.cancel();
    const animation = element.animate(frames, options);
    animations.add(animation);
    pending.set(element, animation);
    const clear = () => {
      animations.delete(animation);
      if (pending.get(element) === animation) pending.delete(element);
    };
    animation.addEventListener("finish", clear, { once: true });
    animation.addEventListener("cancel", clear, { once: true });
    return animation;
  }
  function update() {
    const paused = isPaused();
    root.classList.toggle("motion-paused", paused || document.hidden);
    control.setAttribute("aria-pressed", String(paused));
    control.setAttribute("aria-label", preference.matches ? "系统已开启减少动态效果" : paused ? "开启动效" : "暂停动效");
    control.dataset.tooltip = preference.matches ? "跟随系统：减少动态效果" : paused ? "开启动效" : "暂停动效";
    control.disabled = preference.matches;
    if (paused || document.hidden) {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
    document.dispatchEvent(new CustomEvent("motionchange", { detail: { paused } }));
  }
  control.addEventListener("click", () => {
    userPaused = !userPaused;
    try { localStorage.setItem("mcyh234-motion", userPaused ? "paused" : "full"); } catch {}
    update();
  });
  preference.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  control.hidden = false;
  window.siteMotion = { get paused() { return isPaused(); }, animate };
  update();

  const heroItems = document.querySelectorAll(".hero-content > *");
  heroItems.forEach((element, index) => {
    animate(element, [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 740, delay: 90 + index * 85, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
  });
  document.querySelectorAll(".section-heading, .project-card, .explore-link, .contact-layout > div").forEach((element) => element.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries) => {
    let index = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      animate(entry.target, [
        { opacity: .15, transform: "translateY(28px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 650, delay: Math.min(index++ * 65, 195), easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
    });
  }, { threshold: .12, rootMargin: "0px 0px -20px 0px" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  document.querySelectorAll(".principle").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      animate(details.querySelector(".principle-body"), [
        { opacity: 0, transform: "translateY(-8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 370, easing: "cubic-bezier(.16,1,.3,1)" });
    });
  });

  // FLIP transforms animate actual filtered layout; hidden results stay unfocusable.
  let before = new Map();
  document.addEventListener("projects:before-filter", () => {
    document.querySelectorAll(".project-card").forEach((card) => {
      pending.get(card)?.cancel();
    });
    before = new Map([...document.querySelectorAll(".project-card:not([hidden])")].map((card) => [card, card.getBoundingClientRect()]));
  });
  document.addEventListener("projects:filtered", () => {
    if (isPaused()) return;
    let index = 0;
    document.querySelectorAll(".project-card:not([hidden])").forEach((card) => {
      const previous = before.get(card);
      const current = card.getBoundingClientRect();
      const from = previous
        ? { transform: `translate(${previous.left - current.left}px, ${previous.top - current.top}px)`, opacity: 1 }
        : { transform: "translateY(15px)", opacity: 0 };
      animate(card, [from, { transform: "translate(0,0)", opacity: 1 }], {
        duration: 380, delay: Math.min(index++ * 30, 90), easing: "cubic-bezier(.2,.8,.2,1)",
      });
    });
  });

  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (isPaused() || !finePointer.matches) return;
      const box = button.getBoundingClientRect();
      const x = Math.max(-3, Math.min(3, (event.clientX - box.left - box.width / 2) * .055));
      const y = Math.max(-2, Math.min(2, (event.clientY - box.top - box.height / 2) * .055));
      button.style.translate = `${x}px ${y}px`;
    });
    button.addEventListener("pointerleave", () => { button.style.translate = ""; });
    document.addEventListener("motionchange", () => { button.style.translate = ""; });
  });
})();
