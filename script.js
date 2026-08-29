const AD_LINKS = [
  {
    name: "Adsterra",
    url: "https://conductivebreeds.com/ra35mrxpj?key=a22b76d988f5c2de1a58d61240df16f0"
  },
  {
    name: "Kadam",
    url: "https://viiukuhe.com/dc/?blockID=427920"
  },
  {
    name: "Monetag",
    url: "https://omg10.com/4/9813487"
  }
];

const AD_COOLDOWN = 60 * 1000;
let lastAdTime = 0;

function openAd() {
  const now = Date.now();

  if (now - lastAdTime < AD_COOLDOWN) {
    return false;
  }

  const validLinks = AD_LINKS.filter(function(item) {
    return item.url && item.url.startsWith("http");
  });

  if (!validLinks.length) {
    return false;
  }

  let index = parseInt(
    localStorage.getItem("adIndex") || "0",
    10
  );

  if (index >= validLinks.length) {
    index = 0;
  }

  const selected = validLinks[index];

  localStorage.setItem(
    "adIndex",
    String((index + 1) % validLinks.length)
  );

  lastAdTime = now;

  window.open(
    selected.url,
    "_blank",
    "noopener,noreferrer"
  );

  return true;
}


/* =========================
   LOAD VIDEOS
========================= */

async function loadVideos() {
  try {
    const response = await fetch("videos.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("videos.json tidak ditemukan");
    }

    const videos = await response.json();

    renderVideoList(videos);
    renderPlayer(videos);

  } catch (error) {
    console.error(error);

    const list = document.getElementById("videoList");

    if (list) {
      list.innerHTML = `
        <div class="loading">
          Video belum dapat dimuat.
        </div>
      `;
    }
  }
}


/* =========================
   VIDEO LIST
========================= */

function renderVideoList(videos) {
  const container =
    document.getElementById("videoList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  videos.forEach(function(video, index) {

    const card =
      document.createElement("a");

    card.className = "video-card";

    card.href =
      "player.html?id=" +
      encodeURIComponent(index);

    card.innerHTML = `
      <div class="thumb">

        <video
          src="${escapeHtml(video.file)}"
          muted
          preload="metadata"
          playsinline
        ></video>

        <div class="play-icon">
          ▶
        </div>

      </div>

      <div class="card-content">

        <div class="card-title">
          ${escapeHtml(video.title)}
        </div>

        <div class="card-meta">
          Video #${index + 1}
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}


/* =========================
   PLAYER
========================= */

function renderPlayer(videos) {
  const player =
    document.getElementById("videoPlayer");

  if (!player) {
    return;
  }

  const params =
    new URLSearchParams(
      window.location.search
    );

  let id =
    parseInt(params.get("id"), 10);

  if (
    isNaN(id) ||
    id < 0 ||
    id >= videos.length
  ) {
    id = 0;
  }

  const video = videos[id];

  if (!video) {
    return;
  }

  player.src = video.file;

  const title =
    document.getElementById("videoTitle");

  const description =
    document.getElementById("videoDescription");

  if (title) {
    title.textContent = video.title;
  }

  if (description) {
    description.textContent =
      "Video viral terbaru. Selamat menonton.";
  }

  document.title =
    video.title +
    " - KUMPULAN VIDEO VIRAL";

  renderRelated(videos, id);
}


/* =========================
   RELATED VIDEOS
========================= */

function renderRelated(
  videos,
  currentId
) {
  const container =
    document.getElementById(
      "relatedVideos"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  videos.forEach(function(video, index) {

    if (index === currentId) {
      return;
    }

    if (
      container.children.length >= 8
    ) {
      return;
    }

    const link =
      document.createElement("a");

    link.className =
      "related-card";

    link.href =
      "player.html?id=" +
      encodeURIComponent(index);

    link.textContent =
      "▶ " + video.title;

    container.appendChild(link);
  });
}


/* =========================
   WATCH BUTTON
========================= */

document.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        "#watchButton"
      );

    if (!button) {
      return;
    }

    openAd();

    const player =
      document.getElementById(
        "videoPlayer"
      );

    if (player) {

      const playPromise =
        player.play();

      if (
        playPromise &&
        typeof playPromise.catch ===
        "function"
      ) {
        playPromise.catch(
          function() {}
        );
      }
    }
  }
);


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {
    loadVideos();
  }
);
