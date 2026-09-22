(() => {
  "use strict";
  const T = window.THREE;
  const hero = document.querySelector(".hero");
  const canvas = document.getElementById("pixel-canvas");
  const controls = document.getElementById("scene-controls");
  const content = document.querySelector(".hero-content");
  if (!T) return;

  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    hero.dataset.sceneReady = "false";
    return;
  }
  renderer.setClearColor(0x101410, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-8, 8, 4.5, -4.5, .1, 80);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);
  scene.add(new T.AmbientLight(0xecf4dd, 1.8));
  const key = new T.DirectionalLight(0xffffff, 3.8);
  key.position.set(-4, 7, 10);
  scene.add(key);
  const rim = new T.DirectionalLight(0xa5b8ff, 2.3);
  rim.position.set(6, 1, -1);
  scene.add(rim);

  const assembly = new T.Group();
  scene.add(assembly);
  const core = new T.Group();
  assembly.add(core);
  const cube = new T.BoxGeometry(1, 1, 1);
  const materials = {
    porcelain: new T.MeshStandardMaterial({ color: 0xb9c6ab, roughness: .32, metalness: .15 }),
    green: new T.MeshStandardMaterial({ color: 0xb9ed43, roughness: .27, metalness: .14, emissive: 0x537b0c, emissiveIntensity: .17 }),
    blue: new T.MeshStandardMaterial({ color: 0x6288f7, roughness: .3, metalness: .25 }),
    orange: new T.MeshStandardMaterial({ color: 0xe59c5d, roughness: .35, metalness: .2 }),
    graphite: new T.MeshStandardMaterial({ color: 0x2d3527, roughness: .4, metalness: .3 }),
    frame: new T.MeshStandardMaterial({ color: 0x586748, roughness: .5, metalness: .5 }),
  };
  const parts = [];
  const smile = new Set(["2,0", "0,3", "4,3", "1,4", "2,4", "3,4"]);
  function part(x, y, z, sx, sy, sz, material, spread = 1) {
    const mesh = new T.Mesh(cube, material);
    mesh.scale.set(sx, sy, sz);
    mesh.position.set(x, y, z);
    const index = parts.length;
    parts.push({
      mesh,
      origin: new T.Vector3(x, y, z),
      apart: new T.Vector3(x * (1.18 + spread * .15), y * (1.18 + spread * .15), z + ((index % 5) - 2) * .55 * spread),
      start: new T.Vector3(x * 1.35, y + 4.8 + (index % 7) * .45, z - 2.5),
      index,
    });
    core.add(mesh);
    return mesh;
  }
  part(0, 0, -.53, 4.2, 4.2, .22, materials.graphite, .25);
  part(0, 0, -.72, 4.48, 4.48, .10, materials.frame, .4);
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      const active = smile.has(`${column},${row}`);
      part((column - 2) * .77, (2 - row) * .77, active ? .15 : -.08, .69, .69, active ? .57 : .26, active ? materials.green : materials.porcelain);
    }
  }
  [[-2.02, 2.02], [2.02, 2.02], [-2.02, -2.02], [2.02, -2.02]].forEach(([x, y]) => {
    part(x, y, -.30, .10, .10, .12, materials.blue, 1.2);
  });
  part(-2.67, 1.5, -.20, .49, .88, .3, materials.graphite, 1.4);
  part(-2.67, 1.5, -.02, .32, .54, .10, materials.blue, 1.5);
  part(2.63, -.70, .15, .69, .89, .4, materials.graphite, 1.2);
  part(2.63, -.70, .39, .48, .66, .10, materials.orange, 1.3);
  part(1.02, 2.68, -.65, 1.6, .38, .35, materials.graphite, 1.1);
  for (let i = 0; i < 5; i++) part(.49 + i * .27, 2.68, -.40, .12, .17, .07, materials.green, 1.4);
  part(-.77, -2.58, -.07, 1.94, .34, .39, materials.graphite, 1);
  for (let i = 0; i < 6; i++) part(-1.45 + i * .27, -2.58, .17, .10, .14, .09, i === 5 ? materials.orange : materials.frame, 1.3);

  const traceMaterial = new T.LineBasicMaterial({ color: 0x6f8953, transparent: true, opacity: .56 });
  const signalMaterial = new T.MeshStandardMaterial({ color: 0xccef85, emissive: 0x84a447, emissiveIntensity: .65 });
  const routes = [
    [[-2.65, 1.50, -.4], [-3.0, 1.50, -.4], [-3.0, 2.85, -.4], [.45, 2.85, -.4]],
    [[2.65, -.70, -.3], [3.1, -.70, -.3], [3.1, -2.8, -.3], [-.5, -2.8, -.3]],
    [[-2.1, -1.3, -.4], [-2.8, -1.3, -.4], [-2.8, -2.58, -.4], [-1.75, -2.58, -.4]],
    [[1.8, 2.1, -.6], [2.7, 2.1, -.6], [2.7, .1, -.6], [2.3, .1, -.6]],
  ];
  const vertices = [];
  routes.forEach((route) => {
    for (let index = 0; index < route.length - 1; index++) vertices.push(...route[index], ...route[index + 1]);
  });
  const traces = new T.LineSegments(new T.BufferGeometry(), traceMaterial);
  traces.geometry.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
  core.add(traces);
  const signals = routes.map((route, index) => {
    const mesh = new T.Mesh(cube, signalMaterial);
    mesh.scale.set(.075, .075, .075);
    core.add(mesh);
    return { mesh, route: route.map((point) => new T.Vector3(...point)), offset: index * .24 };
  });

  const guideMaterial = new T.LineBasicMaterial({ color: 0x405333, transparent: true, opacity: .42 });
  const guideVertices = [];
  for (let index = -4; index <= 4; index++) {
    guideVertices.push(-3.6, index * .77, -1.8, 3.6, index * .77, -1.8);
    guideVertices.push(index * .77, -3.6, -1.8, index * .77, 3.6, -1.8);
  }
  const guideGeometry = new T.BufferGeometry();
  guideGeometry.setAttribute("position", new T.Float32BufferAttribute(guideVertices, 3));
  const guide = new T.LineSegments(guideGeometry, guideMaterial);
  core.add(guide);

  let mode = "build";
  let width = 0;
  let height = 0;
  let mobile = false;
  let elapsed = 0;
  let assemblyAge = 0;
  let phase = 0;
  let spread = 0;
  let visible = true;
  let dead = false;
  let frame = null;
  let last = 0;
  let renderAt = 0;
  let centerY = 0;
  let contentBottom = 0;
  let pointerX = 0;
  let pointerY = 0;
  let yaw = 0;
  let targetYaw = 0;
  let pitch = 0;
  let dragging = null;
  const paused = () => window.siteMotion ? window.siteMotion.paused : matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = (value) => 1 - Math.pow(1 - Math.max(0, Math.min(1, value)), 4);

  function pose(dt, snap) {
    const targetSpread = mode === "explode" ? 1 : mode === "connect" ? .22 : 0;
    spread = snap ? targetSpread : spread + (targetSpread - spread) * (1 - Math.exp(-dt * 5));
    yaw = snap ? 0 : yaw + (targetYaw + pointerX * .11 - yaw) * (1 - Math.exp(-dt * 5));
    pitch = snap ? 0 : pitch + (pointerY * .07 - pitch) * (1 - Math.exp(-dt * 5));
    core.rotation.set(-.15 + pitch, -.30 + yaw, .02);
    core.position.y = snap ? 0 : Math.sin(phase * .65) * .07;
    core.position.x = snap ? 0 : Math.sin(phase * .35) * .035;
    parts.forEach((item) => {
      const t = snap ? 1 : ease((assemblyAge - item.index * .009) / 1.1);
      item.mesh.position.lerpVectors(item.origin, item.apart, spread);
      item.mesh.position.lerp(item.start, 1 - t);
      item.mesh.rotation.y = (1 - t) * .5 + (mode === "explode" ? .08 * spread * Math.sin(item.index) : 0);
    });
    traceMaterial.opacity = mode === "connect" ? .94 : mode === "explode" ? .18 : .45;
    guideMaterial.opacity = mode === "connect" ? .65 : .28;
    signals.forEach((signal) => {
      const progress = ((snap ? .23 : phase * .15) + signal.offset) % 1;
      const position = progress * (signal.route.length - 1);
      const index = Math.floor(position);
      signal.mesh.position.lerpVectors(signal.route[index], signal.route[index + 1], position - index);
      signal.mesh.visible = mode !== "explode";
      const size = mode === "connect" ? .115 : .07;
      signal.mesh.scale.setScalar(size);
    });
    const heroTop = hero.getBoundingClientRect().top;
    const scrollOffset = Math.max(0, -heroTop) / height;
    assembly.position.y = centerY + (snap ? 0 : scrollOffset * .22);
  }

  function render(now) {
    frame = null;
    if (dead || !visible || document.hidden) return;
    const minimumInterval = mobile ? 1000 / 30 : 1000 / 60;
    if (!paused() && now - renderAt < minimumInterval - 1) {
      frame = requestAnimationFrame(render);
      return;
    }
    const dt = last ? Math.min((now - last) / 1000, .05) : .016;
    last = now;
    renderAt = now;
    if (!paused()) {
      elapsed += dt;
      assemblyAge += dt;
      phase += dt;
    }
    pose(dt, paused());
    renderer.render(scene, camera);
    canvas.dataset.frame = String(Math.round(elapsed * 1000));
    canvas.dataset.mode = mode;
    if (!paused()) frame = requestAnimationFrame(render);
  }
  function wake() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    last = 0;
    renderAt = 0;
    if (!dead && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    mobile = width <= 700;
    contentBottom = content.offsetTop + content.offsetHeight;
    const controlTop = controls.getBoundingClientRect().top - hero.getBoundingClientRect().top;
    const stageTop = contentBottom + (mobile ? 10 : 0);
    const stageBottom = controlTop - 3;
    const stageHeight = Math.max(130, stageBottom - stageTop);
    const scale = mobile
      ? Math.min((width - 64) / 7.8, stageHeight / 7.4)
      : Math.min(width * .42 / 8, height * .80 / 7.6);
    const viewWidth = width / scale;
    const viewHeight = height / scale;
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    const x = mobile ? width / 2 : width * .762;
    const y = mobile ? (stageTop + stageBottom) / 2 : height * .46;
    assembly.position.x = (x - width / 2) / scale;
    centerY = (height / 2 - y) / scale;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    // Keep the assembly entrance out of the text and controls on narrow screens.
    renderer.setScissorTest(true);
    if (mobile) renderer.setScissor(0, Math.max(0, height - stageBottom), width, stageHeight);
    else renderer.setScissor(width * .51, 66, width * .49, height - 66);
    wake();
  }

  function changeMode(next) {
    mode = next;
    controls.querySelectorAll("[data-scene-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.sceneMode === mode));
    });
    wake();
  }
  controls.querySelectorAll("[data-scene-mode]").forEach((button) => {
    button.addEventListener("click", () => changeMode(button.dataset.sceneMode));
  });
  document.getElementById("scene-replay").addEventListener("click", () => {
    assemblyAge = 0;
    targetYaw = 0;
    changeMode("build");
  });
  hero.addEventListener("pointermove", (event) => {
    if (paused() || event.pointerType === "touch") return;
    const rect = hero.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / width * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / height * 2 - 1));
    if (dragging) targetYaw = Math.max(-.50, Math.min(.65, dragging.yaw + (event.clientX - dragging.x) * .005));
  }, { passive: true });
  hero.addEventListener("pointerdown", (event) => {
    if (paused() || event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("a,button")) return;
    const rect = hero.getBoundingClientRect();
    if (mobile ? event.clientY - rect.top < contentBottom : event.clientX - rect.left < width * .52) return;
    dragging = { x: event.clientX, yaw: targetYaw };
    hero.setPointerCapture(event.pointerId);
  });
  hero.addEventListener("pointerup", () => { dragging = null; });
  hero.addEventListener("pointercancel", () => { dragging = null; });
  hero.addEventListener("lostpointercapture", () => { dragging = null; });
  hero.addEventListener("pointerleave", () => { pointerX = 0; pointerY = 0; });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    dead = true;
    if (frame !== null) cancelAnimationFrame(frame);
    hero.dataset.sceneReady = "false";
    controls.hidden = true;
  });
  document.addEventListener("motionchange", () => {
    pointerX = 0;
    pointerY = 0;
    targetYaw = 0;
    wake();
  });
  document.addEventListener("visibilitychange", wake);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  }).observe(hero);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);
  resizeObserver.observe(content);
  controls.hidden = false;
  hero.dataset.sceneReady = "true";
  resize();
})();
