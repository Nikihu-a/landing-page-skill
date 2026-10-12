const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

// Lamp follows the pointer across the hero; on touch it drifts slowly.
const hero = document.getElementById("hero");
if (!reduce) {
  let tx = 50, ty = 42, x = 50, y = 42, raf = 0, idle = true;
  const tick = (t) => {
    if (idle) { tx = 50 + Math.sin(t / 2600) * 18; ty = 42 + Math.cos(t / 3400) * 10; }
    x += (tx - x) * 0.08; y += (ty - y) * 0.08;
    hero.style.setProperty("--x", x.toFixed(2) + "%");
    hero.style.setProperty("--y", y.toFixed(2) + "%");
    raf = requestAnimationFrame(tick);
  };
  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 100;
    ty = ((e.clientY - r.top) / r.height) * 100;
    idle = false;
  });
  hero.addEventListener("pointerleave", () => { idle = true; });
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(tick);
  }).observe(hero);
}

// Reveal sections as they enter; play the clip only while visible.
const reveal = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
}, { rootMargin: "0px 0px -12% 0px" });
document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

const video = document.querySelector("video");
if (video && !reduce) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
  }, { threshold: 0.3 }).observe(video);
}

// Top bar gets a backdrop once the page scrolls.
const bar = document.querySelector(".topbar");
const onScroll = () => bar.classList.toggle("solid", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Install tabs.
const tabs = [...document.querySelectorAll('[role="tab"]')];
const select = (tab) => {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  }
};
tabs.forEach((t, i) => {
  t.addEventListener("click", () => select(t));
  t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    select(next); next.focus();
  });
});

// Copy buttons.
document.querySelectorAll(".copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.previousElementSibling.textContent;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const r = document.createRange(); r.selectNodeContents(btn.previousElementSibling);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand("copy"); s.removeAllRanges();
    }
    btn.textContent = "Copied";
    setTimeout(() => { btn.textContent = "Copy"; }, 1600);
  });
});
