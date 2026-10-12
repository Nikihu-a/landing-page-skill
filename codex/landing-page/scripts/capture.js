// Injected by the recorder (never shipped): a manual clock so frames can be
// stepped and captured deterministically, even in a hidden tab.
(() => {
  let fake = 0;
  let cbs = [];
  performance.now = () => fake;
  window.requestAnimationFrame = (cb) => { cbs.push(cb); return cbs.length; };
  window.cancelAnimationFrame = () => {};
  let frame = 0;
  window.__cap = {
    pending: () => cbs.length,
    async step(steps, captureEvery) {
      const canvas = document.getElementById("gl");
      let sent = 0;
      for (let k = 0; k < steps; k++) {
        fake += 1000 / 60;
        const run = cbs; cbs = [];
        run.forEach((cb) => cb(fake));
        if (captureEvery && k % captureEvery === 0) {
          const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.93));
          await fetch("/__frame?i=" + frame++, { method: "POST", body: blob });
          sent++;
        }
      }
      return { sent, frame, pending: cbs.length };
    },
  };
})();
