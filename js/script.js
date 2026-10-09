/* =========================================================
   EREN YEAGER — INTERAÇÕES
   ========================================================= */

/* 1. Menu mobile */
const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector("#nav");

menuToggle?.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

/* 2. Barra de progresso */
const progressBar = document.querySelector("#progressBar");

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* 3. Animações de entrada */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 55, 330)}ms`;
  observer.observe(element);
});

/* 4. Partículas no hero */
const particleContainer = document.querySelector("#particles");

if (particleContainer) {
  for (let i = 0; i < 35; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.cssText = `
      position:absolute;
      width:${Math.random() * 3 + 1}px;
      height:${Math.random() * 3 + 1}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      background:rgba(255,255,255,${Math.random() * .35 + .08});
      border-radius:50%;
      animation:floatParticle ${Math.random() * 9 + 7}s linear infinite;
      animation-delay:-${Math.random() * 10}s;
    `;
    particleContainer.appendChild(particle);
  }

  const particleStyle = document.createElement("style");
  particleStyle.textContent = `
    @keyframes floatParticle {
      0% { transform: translate3d(0, 30px, 0); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: .5; }
      100% { transform: translate3d(${Math.random() * 80 - 40}px, -120px, 0); opacity: 0; }
    }
  `;
  document.head.appendChild(particleStyle);
}

/* =========================================================
   5. GIPHY
   ---------------------------------------------------------
   Para ativar a busca automática:
   - crie uma chave no GIPHY Developers
   - substitua "COLOQUE_SUA_CHAVE_GIPHY_AQUI"
   ========================================================= */

const GIPHY_API_KEY = "884As94dBPXmKc5JEhhm2Ramni3ZGiE3";
const GIPHY_QUERY = "Eren Yeager Attack on Titan";
const GIPHY_LIMIT = 9;

async function loadGiphy() {
  const grid = document.querySelector("#gifGrid");

  if (!grid || GIPHY_API_KEY === "COLOQUE_SUA_CHAVE_GIPHY_AQUI") {
    return;
  }

  try {
    grid.innerHTML = `
      <div class="loading-gifs" style="grid-column:1/-1;padding:60px;text-align:center;color:#777">
        CARREGANDO GIFS...
      </div>
    `;

    const url =
      `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(GIPHY_API_KEY)}` +
      `&q=${encodeURIComponent(GIPHY_QUERY)}&limit=${GIPHY_LIMIT}&rating=pg-13&lang=pt`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Não foi possível acessar a API do GIPHY.");
    }

    const result = await response.json();

    if (!result.data?.length) {
      throw new Error("Nenhum GIF encontrado.");
    }

    grid.innerHTML = "";

    result.data.forEach((gif) => {
      const card = document.createElement("article");
      card.className = "gif-card";

      const image =
        gif.images?.fixed_width?.url ||
        gif.images?.downsized?.url ||
        gif.images?.original?.url;

      card.innerHTML = `
        <a href="${gif.url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir GIF no GIPHY">
          <img src="${image}" alt="${escapeHtml(gif.title || "GIF do Eren Yeager")}" loading="lazy">
          <div class="gif-caption">${escapeHtml(gif.title || "Eren Yeager")} ↗</div>
        </a>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.warn("GIPHY:", error);
    grid.innerHTML = `
      <article class="gif-card fallback-gif">
        <div class="fake-gif"><span>EREN</span><small>GIPHY</small></div>
        <div class="gif-caption">Abra a busca no GIPHY ↗</div>
      </article>
      <article class="gif-card fallback-gif">
        <div class="fake-gif variant-two"><span>FREEDOM</span><small>GIPHY</small></div>
        <div class="gif-caption">GIFs de Eren Yeager</div>
      </article>
      <article class="gif-card fallback-gif">
        <div class="fake-gif variant-three"><span>ATTACK</span><small>GIPHY</small></div>
        <div class="gif-caption">Attack on Titan</div>
      </article>
    `;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadGiphy();

/* 6. Pequeno efeito de parallax no símbolo */
window.addEventListener("scroll", () => {
  const symbol = document.querySelector(".hero-symbol");
  if (!symbol) return;

  const y = Math.min(window.scrollY * 0.08, 90);
  symbol.style.transform = `translateY(${y}px)`;
}, { passive: true });
