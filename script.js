/* =========================================================
   KUMPULAN VIDEO VIRAL
   SCRIPT FINAL - DIPERBAIKI
========================================================= */


/* =========================================================
   LINK IKLAN
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
   INDEX IKLAN
========================================================= */

function getAdIndex() {

  let index = parseInt(
    localStorage.getItem("adIndex") || "0",
    10
  );

  if (
    Number.isNaN(index) ||
    index < 0 ||
    index >= AD_LINKS.length
  ) {
    index = 0;
  }

  return index;
}


/* =========================================================
   BUKA IKLAN
========================================================= */

function openAd() {

  const now = Date.now();

  if (
    now - lastAdTime <
    AD_COOLDOWN
  ) {
    return false;
  }


  const validLinks =
    AD_LINKS.filter(function(item) {

      return (
        item &&
        typeof item.url === "string" &&
        /^https?:\/\//i.test(item.url)
      );

    });


  if (!validLinks.length) {
    return false;
  }


  let index =
    getAdIndex();


  if (
    index >= validLinks.length
  ) {
    index = 0;
  }


  const selected =
    validLinks[index];


  localStorage.setItem(
    "adIndex",
    String(
      (index + 1) %
      validLinks.length
    )
  );


  lastAdTime =
    now;


  const newWindow =
    window.open(
      selected.url,
      "_blank",
      "noopener,noreferrer"
    );


  return !!newWindow;

}


/* =========================================================
   LOAD VIDEOS.JSON
========================================================= */

async function loadVideos() {

  try {

    const response =
      await fetch(
        "./videos.json",
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "videos.json tidak ditemukan."
      );

    }


    const videos =
      await response.json();


    if (!Array.isArray(videos)) {

      throw new Error(
        "Format videos.json tidak valid."
      );

    }


    if (!videos.length) {

      throw new Error(
        "videos.json kosong."
      );

    }


    renderVideoList(
      videos
    );


    renderPlayer(
      videos
    );


  } catch (error) {

    console.error(
      "Gagal memuat video:",
      error
    );


    const list =
      document.getElementById(
        "videoList"
      );


    if (list) {

      list.innerHTML = `
        <div class="error-message">
          Video belum dapat dimuat.
          <br>
          Periksa file videos.json.
        </div>
      `;

    }

  }

}


/* =========================================================
   DAFTAR VIDEO
========================================================= */

function renderVideoList(
  videos
) {

  const container =
    document.getElementById(
      "videoList"
    );


  if (!container) {
    return;
  }


  container.innerHTML = "";


  videos.forEach(
    function(video, index) {


      /* =========================
         VALIDASI VIDEO
      ========================== */

      if (
        !video ||
        typeof video.url !== "string" ||
        !video.url.trim()
      ) {
        return;
      }


      /* =========================
         CARD
      ========================== */

      const card =
        document.createElement("a");


      card.className =
        "video-card";


      card.href =
        "./player.html?id=" +
        encodeURIComponent(
          index
        );


      /* =========================
         THUMBNAIL
      ========================== */

      const thumb =
        document.createElement("div");


      thumb.className =
        "thumb";


      const videoElement =
        document.createElement("video");


      videoElement.src =
        video.url;


      videoElement.muted =
        true;


      videoElement.preload =
        "metadata";


      videoElement.playsInline =
        true;


      videoElement.setAttribute(
        "aria-hidden",
        "true"
      );


      const playIcon =
        document.createElement("div");


      playIcon.className =
        "play-icon";


      playIcon.textContent =
        "▶";


      thumb.appendChild(
        videoElement
      );


      thumb.appendChild(
        playIcon
      );


      /* =========================
         CONTENT
      ========================== */

      const content =
        document.createElement("div");


      content.className =
        "card-content";


      const title =
        document.createElement("div");


      title.className =
        "card-title";


      title.textContent =
        video.title ||
        "Video Viral";


      const meta =
        document.createElement("div");


      meta.className =
        "card-meta";


      meta.textContent =
        "Video #" +
        (
          video.id ||
          index + 1
        );


      content.appendChild(
        title
      );


      content.appendChild(
        meta
      );


      card.appendChild(
        thumb
      );


      card.appendChild(
        content
      );


      container.appendChild(
        card
      );

    }
  );


  /* =========================
     JIKA KOSONG
  ========================== */

  if (
    !container.children.length
  ) {

    container.innerHTML = `
      <div class="error-message">
        Tidak ada video yang tersedia.
      </div>
    `;

  }

}


/* =========================================================
   PLAYER
========================================================= */

function renderPlayer(
  videos
) {

  const player =
    document.getElementById(
      "videoPlayer"
    );


  if (!player) {
    return;
  }


  /* =========================
     AMBIL ID URL
  ========================== */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const id =
    params.get("id");


  let index =
    parseInt(
      id,
      10
    );


  if (
    Number.isNaN(index) ||
    index < 0 ||
    index >= videos.length
  ) {

    index = 0;

  }


  const video =
    videos[index];


  /* =========================
     VALIDASI
  ========================== */

  if (
    !video ||
    typeof video.url !== "string" ||
    !video.url.trim()
  ) {

    showPlayerError(
      "Video tidak ditemukan."
    );

    return;

  }


  /* =========================
     SET VIDEO
  ========================== */

  player.src =
    video.url;


  player.load();


  /* =========================
     TITLE
  ========================== */

  const title =
    document.getElementById(
      "videoTitle"
    );


  if (title) {

    title.textContent =
      video.title ||
      "Video Viral";

  }


  /* =========================
     DESCRIPTION
  ========================== */

  const description =
    document.getElementById(
      "videoDescription"
    );


  if (description) {

    description.textContent =
      video.description ||
      "Selamat menonton.";

  }


  /* =========================
     DOCUMENT TITLE
  ========================== */

  document.title =
    (
      video.title ||
      "Video Viral"
    ) +
    " - KUMPULAN VIDEO VIRAL";


  /* =========================
     RELATED
  ========================== */

  renderRelated(
    videos,
    index
  );

}


/* =========================================================
   RELATED VIDEOS
========================================================= */

function renderRelated(
  videos,
  currentIndex
) {

  const container =
    document.getElementById(
      "relatedVideos"
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    "";


  const related =
    videos
      .map(
        function(video, index) {

          return {
            video: video,
            index: index
          };

        }
      )
      .filter(
        function(item) {

          return (
            item.index !==
            currentIndex
          );

        }
      )
      .filter(
        function(item) {

          return (
            item.video &&
            typeof item.video.url ===
            "string" &&
            item.video.url.trim()
          );

        }
      )
      .slice(
        0,
        6
      );


  related.forEach(
    function(item) {

      const link =
        document.createElement(
          "a"
        );


      link.className =
        "related-card";


      link.href =
        "./player.html?id=" +
        encodeURIComponent(
          item.index
        );


      link.textContent =
        "▶ " +
        (
          item.video.title ||
          "Video Viral"
        );


      container.appendChild(
        link
      );

    }
  );

}


/* =========================================================
   ERROR PLAYER
========================================================= */

function showPlayerError(
  message
) {

  const title =
    document.getElementById(
      "videoTitle"
    );


  const description =
    document.getElementById(
      "videoDescription"
    );


  if (title) {

    title.textContent =
      "Video tidak tersedia";

  }


  if (description) {

    description.textContent =
      message;

  }

}


/* =========================================================
   TOMBOL TONTON
========================================================= */

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


    /* =========================
       IKLAN
    ========================== */

    openAd();


    /* =========================
       PLAY VIDEO
    ========================== */

    const player =
      document.getElementById(
        "videoPlayer"
      );


    if (!player) {
      return;
    }


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
);


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadVideos();

  }
);
