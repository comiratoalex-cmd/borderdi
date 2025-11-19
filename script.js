/* ======================================================
   BORDERDI PRO V2 — THEOOO MODE (Glow Minimal + Medium Speed)
====================================================== */

/* ------------------------------------------------------
   ELEMENT REFERENCES
------------------------------------------------------ */
const preview = document.getElementById("preview");

const cols = [c1, c2, c3, c4, c5, c6];

const speedRange = document.getElementById("speedRange");
const direction = document.getElementById("direction");
const heightControl = document.getElementById("height");
const glow = document.getElementById("glow");
const preset = document.getElementById("preset");
const rgbMode = document.getElementById("rgbMode");
const borderType = document.getElementById("borderType");

const obsMode = document.getElementById("obsMode");
const downloadWEBM = document.getElementById("downloadWEBM");
const copyCSS = document.getElementById("copyCSS");

const obsLinkField = document.getElementById("obsLink");
const copyOBSLink = document.getElementById("copyOBSLink");

/* ------------------------------------------------------
   AGBC GRADIENT ENGINE
------------------------------------------------------ */

let agbcOffset = 0;

function animateAGBC() {
  const speed = parseFloat(speedRange.value);
  agbcOffset += speed * 0.0008;
  if (agbcOffset > 1) agbcOffset = 0;

  preview.style.backgroundPosition = `${agbcOffset * 400}% 50%`;

  requestAnimationFrame(animateAGBC);
}
animateAGBC();

/* ------------------------------------------------------
   MAIN UPDATE FUNCTION
------------------------------------------------------ */
function update() {
  const colors = cols.map(c => c.value);
  const dir = direction.value;
  const h = Number(heightControl.value);
  const g = Number(glow.value);

  preview.style.height = (h + 10) + "px"; /* +10px glow minimal */
  preview.style.background = `linear-gradient(${dir}, ${colors.join(",")})`;
  preview.style.backgroundSize = "400% 400%";
  preview.style.boxShadow = `0 0 ${g}px ${colors[3]}`;

  applyBorderType();
  generateOBSLink();
}

/* ------------------------------------------------------
   BORDER TYPE
------------------------------------------------------ */
function applyBorderType() {
  preview.className = "";

  switch (borderType.value) {
    case "top": preview.classList.add("top"); break;
    case "bottom": preview.classList.add("bottom"); break;
    case "left": preview.classList.add("left"); break;
    case "right": preview.classList.add("right"); break;
    case "fullframe": preview.classList.add("fullframe"); break;
  }
}

/* ------------------------------------------------------
   OBS LINK GENERATOR (HASH SYSTEM)
------------------------------------------------------ */
function generateOBSLink() {
  const base = window.location.origin + window.location.pathname.replace("index.html","");

  const params = [
    `type=${borderType.value}`,
    `speed=${speedRange.value}`,
    `dir=${direction.value}`,
    `h=${heightControl.value}`,
    `glow=${glow.value}`,
    `c1=${c1.value}`,
    `c2=${c2.value}`,
    `c3=${c3.value}`,
    `c4=${c4.value}`,
    `c5=${c5.value}`,
    `c6=${c6.value}`
  ].join("&");

  obsLinkField.value = `${base}obs.html#${params}`;
}

copyOBSLink.onclick = () => {
  navigator.clipboard.writeText(obsLinkField.value);
  alert("OBS link copied!");
};

/* ------------------------------------------------------
   WEBM EXPORT (CANVAS MODE)
------------------------------------------------------ */
downloadWEBM.onclick = () => {
  alert("Recording 4 seconds…");

  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = Number(heightControl.value) + 10;

  const ctx = canvas.getContext("2d");

  let t = 0;
  const chunks = [];

  const stream = canvas.captureStream(60);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type:"video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neon.webm";
    a.click();
  };

  recorder.start();

  function draw() {
    t += 0.008 * Number(speedRange.value);

    const colors = cols.map(c => c.value);
    const grad = ctx.createLinearGradient(0,0,canvas.width,0);
    colors.forEach((c,i)=> grad.addColorStop(((i/colors.length)+t)%1,c));

    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (performance.now() < 4000) {
      requestAnimationFrame(draw);
    } else {
      recorder.stop();
    }
  }

  draw();
};

/* ------------------------------------------------------
   OBS MODE OPEN
------------------------------------------------------ */
obsMode.onclick = () => {
  window.open(obsLinkField.value, "_blank");
};

/* INIT */
update();
