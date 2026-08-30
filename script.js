/* =========================================================
   KUMPULAN VIDEO VIRAL
   SMARTLINK: ADSTERRA → KADAM → MONETAG
========================================================= */

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

/* =========================================================
   PENGATURAN IKLAN
========================================================= */

const AD_COOLDOWN = 60 * 1000;
let lastAdTime = 0;

/* =========================================================
   BUKA SMARTLINK
========================================================= */

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

  if (
    Number.isNaN(index) ||
    index >= validLinks.length
  ) {
    index = 0;
  }

  const selected = validLinks[index];

  localStorage.setItem(
    "adIndex",
    String((index + 1) % validLinks.length)
  );

  lastAdTime = now;

  /*
    Dibuka hanya sebagai respons
    terhadap klik pengguna.
  */

  const adWindow = window.open(
    selected.url,
    "_blank",
    "noopener,noreferrer"
  );

  return !!adWindow;
}


/* =========================================================
   LOAD VIDEOS
========================================================= */

async function loadVideos() {

  try {

    const response = await fetch(
      "videos.json",
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        "videos.json tidak ditemukan."
      );
    }

    const videos = await response.json();

    if (!Array.isArray(videos)) {
      throw new Error(
        "Format videos.json tidak valid."
      );
    }

    renderVideoList(videos);
    renderPlayer(videos);

  } catch (error) {

    console.error(error);

    const list =
      document.getElementById("videoList");

    if (list) {

      list.innerHTML = `
        <div class="loading">
          Video belum dapat dimuat.
        </div>
      `;

    }

  }

}


/* =========================================================
   VIDEO LIST
========================================================= */

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

    card.className =
      "video-card";

    card.href =
      "player.html?id=" +
      encodeURIComponent(video.id);

    card.innerHTML = `

      <div class="thumb">

        <video
          src="${escapeHtml(video.url)}"
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


/* =========================================================
   KLIK KARTU VIDEO
   SMARTLINK DIBUKA SAAT USER KLIK
========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const card =
      event.target.closest(".video-card");

    if (!card) {
      return;
    }

    /*
      Jangan cegah navigasi.
      Halaman video tetap dibuka normal.

      Smartlink hanya dicoba sekali
      berdasarkan cooldown.
    */

    openAd();

  }
);


/* =========================================================
   PLAYER
========================================================= */

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

  const id =
    params.get("id");

  const video =
    videos.find(function(item) {

      return String(item.id) ===
        String(id);

    }) || videos[0];

  if (!video) {
    return;
  }

  player.src = video.url;

  const title =
    document.getElementById("videoTitle");

  const description =
    document.getElementById("videoDescription");

  if (title) {
    title.textContent = video.title;
  }

  if (description) {
    description.textContent =
      video.description ||
      "Selamat menonton.";
  }

  document.title =
    video.title +
    " - KUMPULAN VIDEO VIRAL";

  renderRelated(
    videos,
    video.id
  );

}


/* =========================================================
   RELATED VIDEOS
========================================================= */

function renderRelated(
  videos,
  currentId
) {

  const container =
    document.getElementById("relatedVideos");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  videos
    .filter(function(video) {

      return String(video.id) !==
        String(currentId);

    })
    .slice(0, 6)
    .forEach(function(video) {

      const link =
        document.createElement("a");

      link.className =
        "related-card";

      link.href =
        "player.html?id=" +
        encodeURIComponent(video.id);

      link.textContent =
        "▶ " + video.title;

      container.appendChild(link);

    });

}


/* =========================================================
   TOMBOL TONTON VIDEO
========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest("#watchButton");

    if (!button) {
      return;
    }

    const player =
      document.getElementById("videoPlayer");

    if (player) {

      const playPromise =
        player.play();

      if (
        playPromise &&
        typeof playPromise.catch === "function"
      ) {

        playPromise.catch(
          function() {}
        );

      }

    }

  }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadVideos();

  }
);
