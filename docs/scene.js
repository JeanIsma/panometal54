const PALETTE = {
  mistTop: "#eef3f2",
  mistBottom: "#d7e0df",
  paper: "#f7f5ef",
  paper2: "#e8eeec",
  ink: "#111311",
  dark: "#2b3230",
  steel: "#6f7d7a",
  steelLight: "#b8c5c2",
  orange: "#ff5a1f",
  orangeLight: "#ffb177",
  blue: "#8eb2b8",
  white: "#ffffff"
};

const STAGES = [
  { id: "01", title: "Ä°htiyaÃ§", subtitle: "FotoÄŸraf ve talep", x: 0 },
  { id: "02", title: "Ã–lÃ§Ã¼ & Plan", subtitle: "Malzeme ve hazÄ±rlÄ±k", x: 470 },
  { id: "03", title: "Ãœretim", subtitle: "Kesim ve kaynak", x: 940 },
  { id: "04", title: "Teslim", subtitle: "Montaj ve sonuÃ§", x: 1410 }
];

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => 1 - Math.pow(1 - clamp(t), 3);

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawIsoBox(ctx, x, y, w, h, d, colors) {
  const skew = d * 0.58;
  ctx.fillStyle = colors.top;
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x + w, y - h);
  ctx.lineTo(x + w + skew, y - h - d * 0.36);
  ctx.lineTo(x + skew, y - h - d * 0.36);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colors.front;
  ctx.fillRect(x, y - h, w, h);

  ctx.fillStyle = colors.side;
  ctx.beginPath();
  ctx.moveTo(x + w, y - h);
  ctx.lineTo(x + w + skew, y - h - d * 0.36);
  ctx.lineTo(x + w + skew, y - d * 0.36);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
}

function drawShadow(ctx, x, y, rx, ry, alpha = 0.12) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  gradient.addColorStop(0, `rgba(17,19,17,${alpha})`);
  gradient.addColorStop(1, "rgba(17,19,17,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStagePad(ctx, x, y, active, time) {
  drawShadow(ctx, x, y + 24, 130, 48, 0.11);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = active ? "rgba(255,255,255,.92)" : "rgba(247,249,248,.72)";
  ctx.strokeStyle = active ? "rgba(255,90,31,.34)" : "rgba(92,109,105,.14)";
  ctx.lineWidth = active ? 2.4 : 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 130, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = active ? `rgba(255,90,31,${0.26 + Math.sin(time * 0.003) * 0.05})` : "rgba(92,109,105,.10)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 93, 34, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawLabel(ctx, x, y, stage, active, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const w = 198;
  const h = 66;
  drawShadow(ctx, 0, 15, 100, 26, active ? 0.1 : 0.05);
  roundedRect(ctx, -w / 2, -h / 2, w, h, 19);
  ctx.fillStyle = active ? "rgba(247,245,239,.98)" : "rgba(247,245,239,.82)";
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(255,90,31,.35)" : "rgba(17,19,17,.08)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = active ? PALETTE.orange : PALETTE.ink;
  ctx.beginPath();
  ctx.arc(-70, 0, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = active ? PALETTE.white : PALETTE.paper;
  ctx.font = "800 13px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(stage.id, -70, 0);

  ctx.textAlign = "left";
  ctx.fillStyle = PALETTE.ink;
  ctx.font = "700 16px Inter, Arial, sans-serif";
  ctx.fillText(stage.title, -38, -8);
  ctx.fillStyle = "#6d7976";
  ctx.font = "600 10px Inter, Arial, sans-serif";
  ctx.fillText(stage.subtitle.toUpperCase(), -38, 13);
  ctx.restore();
}

function drawPerson(ctx, x, y, scale, helmet = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawShadow(ctx, 0, 4, 22, 8, 0.13);
  ctx.fillStyle = PALETTE.dark;
  roundedRect(ctx, -12, -48, 24, 34, 7);
  ctx.fill();
  ctx.fillRect(-10, -15, 8, 20);
  ctx.fillRect(2, -15, 8, 20);
  ctx.fillStyle = "#c89676";
  ctx.beginPath();
  ctx.arc(0, -58, 9, 0, Math.PI * 2);
  ctx.fill();
  if (helmet) {
    ctx.fillStyle = PALETTE.ink;
    roundedRect(ctx, -12, -68, 24, 18, 6);
    ctx.fill();
    ctx.fillStyle = PALETTE.blue;
    ctx.fillRect(-8, -62, 16, 7);
  }
  ctx.restore();
}

function drawHouse(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawShadow(ctx, 0, 9, 72, 23, 0.11);
  drawIsoBox(ctx, -54, 5, 88, 58, 32, {
    top: "#fbfaf5",
    front: "#eeeee8",
    side: "#cfd7d5"
  });
  ctx.fillStyle = PALETTE.dark;
  ctx.fillRect(-30, -28, 23, 33);
  ctx.fillStyle = PALETTE.blue;
  ctx.fillRect(9, -31, 17, 17);
  ctx.fillStyle = "#788481";
  ctx.beginPath();
  ctx.moveTo(-62, -51);
  ctx.lineTo(-11, -82);
  ctx.lineTo(52, -51);
  ctx.lineTo(40, -42);
  ctx.lineTo(-49, -42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPhotoCard(ctx, x, y, scale, time) {
  ctx.save();
  ctx.translate(x, y + Math.sin(time * 0.002) * 3);
  ctx.scale(scale, scale);
  drawShadow(ctx, 0, 20, 45, 14, 0.1);
  roundedRect(ctx, -42, -42, 84, 70, 12);
  ctx.fillStyle = PALETTE.paper;
  ctx.fill();
  ctx.strokeStyle = "rgba(17,19,17,.12)";
  ctx.stroke();
  ctx.fillStyle = "#b9c6c3";
  roundedRect(ctx, -31, -29, 62, 39, 8);
  ctx.fill();
  ctx.fillStyle = PALETTE.orange;
  ctx.beginPath();
  ctx.arc(18, -18, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.dark;
  ctx.beginPath();
  ctx.moveTo(-25, 5);
  ctx.lineTo(-5, -12);
  ctx.lineTo(6, -3);
  ctx.lineTo(22, -18);
  ctx.lineTo(31, 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#7b8784";
  ctx.fillRect(-22, 17, 44, 4);
  ctx.restore();
}

function drawMeasureArrows(ctx, x, y, scale, pulse) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = PALETTE.orange;
  ctx.fillStyle = PALETTE.orange;
  ctx.globalAlpha = 0.7 + pulse * 0.25;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-55, 0); ctx.lineTo(55, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-55, 0); ctx.lineTo(-46, -5); ctx.lineTo(-46, 5); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(55, 0); ctx.lineTo(46, -5); ctx.lineTo(46, 5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PALETTE.ink;
  ctx.globalAlpha = 1;
  ctx.font = "700 10px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Ã–LÃ‡Ãœ", 0, -9);
  ctx.restore();
}

function drawBlueprint(ctx, x, y, scale, unfold) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * (0.35 + 0.65 * unfold), scale);
  drawShadow(ctx, 0, 14, 64, 20, 0.09);
  ctx.fillStyle = "#f8fbfa";
  ctx.strokeStyle = "#8faeae";
  ctx.lineWidth = 2;
  roundedRect(ctx, -58, -38, 116, 72, 9);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(74,139,150,.65)";
  ctx.lineWidth = 1.4;
  ctx.strokeRect(-39, -20, 53, 33);
  ctx.beginPath();
  ctx.moveTo(-39, 22); ctx.lineTo(38, 22);
  ctx.moveTo(24, -20); ctx.lineTo(24, 22);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.orange;
  ctx.beginPath();
  ctx.moveTo(-45, -28); ctx.lineTo(43, -28);
  ctx.stroke();
  ctx.restore();
}

function drawSteelBars(ctx, x, y, scale, slide) {
  ctx.save();
  ctx.translate(x + slide * 18, y);
  ctx.scale(scale, scale);
  for (let i = 0; i < 5; i++) {
    const yy = -i * 8;
    drawIsoBox(ctx, -48 + i * 3, yy, 82, 5, 11, {
      top: "#9ca9a6",
      front: i % 2 ? "#4b5552" : "#5f6b68",
      side: "#323a38"
    });
  }
  ctx.restore();
}

function drawSaw(ctx, x, y, scale, time, active) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawShadow(ctx, 0, 5, 58, 17, 0.12);
  drawIsoBox(ctx, -48, 3, 78, 18, 18, {
    top: "#7a8784",
    front: "#333a38",
    side: "#202624"
  });
  ctx.fillStyle = PALETTE.dark;
  ctx.fillRect(-22, -44, 8, 33);
  ctx.save();
  ctx.translate(-6, -39);
  ctx.rotate(active ? time * 0.006 : 0.2);
  ctx.fillStyle = "#a8b4b2";
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4d5956";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(20, 0); ctx.stroke();
  }
  ctx.restore();
  if (active) {
    ctx.strokeStyle = PALETTE.orangeLight;
    for (let i = 0; i < 5; i++) {
      const a = time * 0.005 + i;
      ctx.beginPath();
      ctx.moveTo(14, -17);
      ctx.lineTo(25 + Math.cos(a) * 15, -18 + Math.sin(a) * 17);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawWorkshop(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawShadow(ctx, 0, 14, 104, 29, 0.12);
  ctx.fillStyle = "rgba(255,255,255,.78)";
  ctx.strokeStyle = "rgba(17,19,17,.14)";
  ctx.lineWidth = 2;
  roundedRect(ctx, -90, -70, 180, 84, 13);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = PALETTE.dark;
  ctx.fillRect(-83, -62, 7, 76);
  ctx.fillRect(76, -62, 7, 76);
  ctx.fillRect(-83, -62, 166, 7);
  ctx.fillStyle = PALETTE.orange;
  ctx.fillRect(-34, -50, 68, 6);
  ctx.fillStyle = "#86928f";
  ctx.fillRect(-63, -21, 126, 8);
  ctx.restore();
}

function drawWeldingTable(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawIsoBox(ctx, -45, 3, 72, 13, 22, {
    top: "#75817e",
    front: "#3e4745",
    side: "#29302e"
  });
  ctx.fillStyle = PALETTE.dark;
  ctx.fillRect(-38, 3, 6, 32);
  ctx.fillRect(19, 3, 6, 32);
  ctx.restore();
}

function drawCabinetFrame(ctx, x, y, scale, build) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.globalAlpha = 0.35 + build * 0.65;
  ctx.strokeStyle = PALETTE.dark;
  ctx.lineWidth = 5;
  const w = 70 * build;
  const h = 76 * build;
  ctx.strokeRect(-w / 2, -h, w, h);
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    const yy = -h + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(-w / 2, yy); ctx.lineTo(w / 2, yy); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawSparks(ctx, x, y, scale, time, intensity) {
  if (intensity <= 0.01) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = PALETTE.orangeLight;
  ctx.fillStyle = "#fff5e8";
  ctx.beginPath(); ctx.arc(0, 0, 5 + intensity * 3, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 22; i++) {
    const seed = i * 13.71;
    const life = (time * 0.0018 + seed) % 1;
    const angle = -Math.PI * 0.05 + (i / 22) * Math.PI * 1.15;
    const distance = life * (28 + (i % 5) * 8) * intensity;
    const sx = Math.cos(angle) * distance;
    const sy = Math.sin(angle) * distance + life * life * 35;
    ctx.globalAlpha = (1 - life) * intensity;
    ctx.lineWidth = 1 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }
  ctx.restore();
}

function drawVan(ctx, x, y, scale, move) {
  ctx.save();
  ctx.translate(x + move * 70, y);
  ctx.scale(scale, scale);
  drawShadow(ctx, 0, 8, 65, 17, 0.13);
  drawIsoBox(ctx, -55, 2, 83, 36, 18, {
    top: "#ffffff",
    front: "#e9ece8",
    side: "#c5cecc"
  });
  drawIsoBox(ctx, 27, 2, 34, 29, 18, {
    top: "#f7f7f3",
    front: "#dfe4e1",
    side: "#b9c3c0"
  });
  ctx.fillStyle = PALETTE.orange;
  ctx.fillRect(-42, -15, 70, 5);
  ctx.fillStyle = PALETTE.blue;
  ctx.fillRect(36, -21, 19, 12);
  ctx.fillStyle = PALETTE.ink;
  for (const wx of [-30, 38]) {
    ctx.beginPath(); ctx.arc(wx, 4, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#909b98";
    ctx.beginPath(); ctx.arc(wx, 4, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PALETTE.ink;
  }
  ctx.restore();
}

function drawPanel(ctx, x, y, scale, open = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawShadow(ctx, 0, 7, 52, 15, 0.1);
  ctx.fillStyle = "#323937";
  ctx.strokeStyle = "#161918";
  ctx.lineWidth = 3;
  roundedRect(ctx, -45, -68, 90, 68, 5);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#77817f";
  ctx.lineWidth = 2;
  ctx.strokeRect(-38, -61, 76, 54);
  ctx.fillStyle = PALETTE.orange;
  ctx.fillRect(-12, -43, 24, 18);
  ctx.fillStyle = PALETTE.ink;
  ctx.fillRect(-25, -33, 7, 20);
  ctx.fillStyle = "#c8d0ce";
  ctx.fillRect(40, -58, 4, 16);
  if (open > 0.01) {
    ctx.globalAlpha = open;
    ctx.fillStyle = "#242a28";
    ctx.fillRect(-35, -55, 70, 43);
    ctx.strokeStyle = "#899491";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(-30, -44 + i * 13); ctx.lineTo(30, -44 + i * 13); ctx.stroke();
    }
  }
  ctx.restore();
}

function sampleRoute(t) {
  const p = clamp(t);
  const x = lerp(STAGES[0].x, STAGES[3].x, p);
  const y = Math.sin(p * Math.PI * 3.2) * 24 + Math.sin(p * Math.PI) * -14;
  return { x, y };
}

function drawRoute(ctx, transform, progress, activeStage, time) {
  const points = [];
  for (let i = 0; i <= 160; i++) points.push(sampleRoute(i / 160));

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(73,87,83,.32)";
  ctx.lineWidth = 14 * transform.scale;
  ctx.beginPath();
  points.forEach((pt, i) => {
    const s = transform.worldToScreen(pt.x, pt.y + 62);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.stroke();

  const visible = Math.floor(progress * 160);
  if (visible > 0) {
    const gradient = ctx.createLinearGradient(0, 0, transform.width, 0);
    gradient.addColorStop(0, PALETTE.orangeLight);
    gradient.addColorStop(1, PALETTE.orange);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 7 * transform.scale;
    ctx.shadowColor = "rgba(255,90,31,.30)";
    ctx.shadowBlur = 12 * transform.scale;
    ctx.beginPath();
    for (let i = 0; i <= visible; i++) {
      const pt = points[i];
      const s = transform.worldToScreen(pt.x, pt.y + 62);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    }
    const tip = sampleRoute(progress);
    const tipScreen = transform.worldToScreen(tip.x, tip.y + 62);
    ctx.lineTo(tipScreen.x, tipScreen.y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = PALETTE.white;
    ctx.beginPath();
    ctx.arc(tipScreen.x, tipScreen.y, (6 + Math.sin(time * 0.008) * 1.3) * transform.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PALETTE.orange;
    ctx.lineWidth = 3 * transform.scale;
    ctx.stroke();
  }
  ctx.restore();
}

function createTransform(width, height, progress, pointerX, pointerY, mobile) {
  const currentWorldX = lerp(STAGES[0].x, STAGES[3].x, progress);
  const scale = mobile ? Math.min(width / 500, 0.92) : Math.min(width / 1250, 1.15);
  const focusX = mobile ? width * 0.52 : width * 0.68;
  const focusY = mobile ? height * 0.42 : height * 0.52;
  const cameraX = currentWorldX - (mobile ? 0 : 40) - pointerX * 18;
  const cameraY = pointerY * 12;
  return {
    width,
    height,
    scale,
    worldToScreen(x, y) {
      return {
        x: (x - cameraX) * scale + focusX,
        y: (y - cameraY) * scale + focusY
      };
    }
  };
}

export function create3DExperience(canvas, { onReady } = {}) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    canvas.hidden = true;
    return { failed: true, setProgress() {}, destroy() {} };
  }

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 1;
  let height = 1;
  let targetProgress = 0;
  let progress = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let raf = 0;
  let destroyed = false;
  let lastTime = performance.now();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  function drawBackground() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, PALETTE.mistTop);
    gradient.addColorStop(1, PALETTE.mistBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.17;
    ctx.strokeStyle = "#9eadaa";
    ctx.lineWidth = 1;
    const grid = Math.max(38, Math.min(64, width / 22));
    for (let x = -height; x < width + height; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height, 0);
      ctx.stroke();
    }
    for (let x = 0; x < width + height; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - height, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawScene(time) {
    drawBackground();
    const mobile = width < 760;
    const transform = createTransform(width, height, progress, pointerX, pointerY, mobile);
    const activeStage = progress < 0.22 ? 0 : progress < 0.47 ? 1 : progress < 0.73 ? 2 : 3;

    drawRoute(ctx, transform, progress, activeStage, time);

    STAGES.forEach((stage, index) => {
      const screen = transform.worldToScreen(stage.x, 0);
      const distance = Math.abs(stage.x - lerp(STAGES[0].x, STAGES[3].x, progress));
      const alpha = mobile ? clamp(1 - distance / 700, 0.08, 1) : clamp(1 - distance / 1150, 0.16, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      drawStagePad(ctx, screen.x, screen.y, index === activeStage, time);

      const local = clamp(1 - Math.abs(progress - [0.08, 0.37, 0.65, 0.92][index]) / 0.23);
      const pulse = (Math.sin(time * 0.004) + 1) / 2;

      if (index === 0) {
        drawHouse(ctx, screen.x - 50 * transform.scale, screen.y - 18 * transform.scale, 0.78 * transform.scale);
        drawPerson(ctx, screen.x + 43 * transform.scale, screen.y + 2 * transform.scale, 0.72 * transform.scale);
        drawPhotoCard(ctx, screen.x + 78 * transform.scale, screen.y - 78 * transform.scale, 0.62 * transform.scale, time);
        drawMeasureArrows(ctx, screen.x - 15 * transform.scale, screen.y + 37 * transform.scale, 0.75 * transform.scale, local);
      } else if (index === 1) {
        drawBlueprint(ctx, screen.x - 45 * transform.scale, screen.y - 55 * transform.scale, 0.82 * transform.scale, ease(local));
        drawSteelBars(ctx, screen.x + 55 * transform.scale, screen.y + 4 * transform.scale, 0.75 * transform.scale, local);
        drawSaw(ctx, screen.x + 2 * transform.scale, screen.y + 3 * transform.scale, 0.7 * transform.scale, time, index === activeStage);
      } else if (index === 2) {
        drawWorkshop(ctx, screen.x, screen.y - 11 * transform.scale, 0.72 * transform.scale);
        drawWeldingTable(ctx, screen.x - 14 * transform.scale, screen.y + 7 * transform.scale, 0.72 * transform.scale);
        drawPerson(ctx, screen.x - 15 * transform.scale, screen.y + 4 * transform.scale, 0.65 * transform.scale, true);
        drawCabinetFrame(ctx, screen.x + 70 * transform.scale, screen.y + 8 * transform.scale, 0.68 * transform.scale, ease(local));
        drawSparks(ctx, screen.x + 3 * transform.scale, screen.y - 37 * transform.scale, 0.8 * transform.scale, time, index === activeStage ? 1 : 0.2);
      } else {
        drawHouse(ctx, screen.x + 62 * transform.scale, screen.y - 8 * transform.scale, 0.72 * transform.scale);
        drawPanel(ctx, screen.x + 48 * transform.scale, screen.y + 3 * transform.scale, 0.58 * transform.scale, local * 0.3);
        drawVan(ctx, screen.x - 90 * transform.scale, screen.y + 17 * transform.scale, 0.62 * transform.scale, ease(local));
        drawPerson(ctx, screen.x + 108 * transform.scale, screen.y + 4 * transform.scale, 0.59 * transform.scale);
      }

      const labelY = mobile ? screen.y - 155 * transform.scale : screen.y - 176 * transform.scale;
      drawLabel(ctx, screen.x, labelY, stage, index === activeStage, Math.max(0.72, transform.scale * 0.9));
      ctx.restore();
    });

    // Clear visual hierarchy message at top right of the canvas.
    ctx.save();
    ctx.globalAlpha = mobile ? 0 : 0.72;
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "700 10px Inter, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("KAYDIRDIKÃ‡A ÃœRETÄ°M SÃœRECÄ° Ä°LERLER", width - 36, 54);
    ctx.fillStyle = PALETTE.orange;
    ctx.fillRect(width - 242, 64, 206 * progress, 3);
    ctx.fillStyle = "rgba(17,19,17,.12)";
    ctx.fillRect(width - 242 + 206 * progress, 64, 206 * (1 - progress), 3);
    ctx.restore();
  }

  function animate(time) {
    if (destroyed) return;
    const dt = Math.min(0.05, (time - lastTime) / 1000);
    lastTime = time;
    const response = reducedMotion.matches ? 1 : 1 - Math.exp(-7.2 * dt);
    progress += (targetProgress - progress) * response;
    pointerX += (targetPointerX - pointerX) * (1 - Math.exp(-5 * dt));
    pointerY += (targetPointerY - pointerY) * (1 - Math.exp(-5 * dt));
    drawScene(time);
    raf = requestAnimationFrame(animate);
  }

  function onPointer(event) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    targetPointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetPointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  resize();
  drawScene(performance.now());
  raf = requestAnimationFrame(animate);
  requestAnimationFrame(() => onReady?.());

  return {
    failed: false,
    setProgress(value) {
      targetProgress = clamp(value);
      if (reducedMotion.matches) progress = targetProgress;
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    }
  };
}
