/* =========================================================
   KUMPULAN VIDEO VIRAL
   MONETAG POPUNDER + DIRECTLINK
========================================================= */


/* =========================================================
   MONETAG DIRECTLINK
========================================================= */

const MONETAG_DIRECTLINK =
  "https://omg10.com/4/11840997";


/* =========================================================
   BUKA DIRECTLINK
========================================================= */

function openDirectlink() {

  if (
    !MONETAG_DIRECTLINK ||
    !/^https?:\/\//i.test(MONETAG_DIRECTLINK)
  ) {
    return;
  }

  window.open(
    MONETAG_DIRECTLINK,
    "_blank",
    "noopener,noreferrer"
  );

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

    renderVideoList(videos);
    renderPlayer(videos);

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

function renderVideoList(videos) {

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

      if (
        !video ||
        typeof video.url !== "string" ||
        !video.url.trim()
      ) {
        return;
      }

      const card =
        document.createElement("a");

      card.className =
        "video-card";

      card.href =
        "./player.html?id=" +
        encodeURIComponent(index);


      /* DIRECTLINK MONETAG */

      card.addEventListener(
        "click",
        function() {
          openDirectlink();
        }
      );


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

function renderPlayer(videos) {

  const player =
    document.getElementById(
      "videoPlayer"
    );

  if (!player) {
    return;
  }


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


  player.src =
    video.url;

  player.load();


  const title =
    document.getElementById(
      "videoTitle"
    );


  if (title) {

    title.textContent =
      video.title ||
      "Video Viral";

  }


  const description =
    document.getElementById(
      "videoDescription"
    );


  if (description) {

    description.textContent =
      video.description ||
      "Selamat menonton.";

  }


  document.title =
    (
      video.title ||
      "Video Viral"
    ) +
    " - KUMPULAN VIDEO VIRAL";


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


  container.innerHTML = "";


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


      /* DIRECTLINK MONETAG */

      link.addEventListener(
        "click",
        function() {
          openDirectlink();
        }
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

function showPlayerError(message) {

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
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadVideos();

  }
);

"player.html" — Popunder Monetag

Di dalam "<head>", pasang persis script Popunder yang kamu kirim:

:::writing{variant="standard" id="91354" title="Popunder Monetag"}

<script>(function(s){s.dataset.zone='11840950',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>

Jadi sekarang:

Popunder: "11840950"
Directlink: "https://omg10.com/4/11840997"

"style.css", "videos.json", dan tampilan website tidak perlu diubah.
