(() => {
  let theme;
  try {
    theme = localStorage.getItem("mcyh234-theme");
  } catch {}
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#171b19" : "#f8f9f6";
})();
