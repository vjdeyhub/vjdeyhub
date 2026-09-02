/* =========================================================
   KUMPULAN VIDEO VIRAL
   SCRIPT FINAL
========================================================= */


/* =========================================================
   SMARTLINK
   ========================================================= */

const SMARTLINKS = [
  {
    name: "Adsterra",
    url: "https://omg10.com/4/9813487"
  },
  {
    name: "Kadam",
    url: "https://omg10.com/4/9813487"
  },
  {
    name: "Monetag",
    url: "https://omg10.com/4/9813487"
  }
];


/* =========================================================
   INDEX SMARTLINK
========================================================= */

function getSmartlinkIndex() {

  let index = parseInt(
    localStorage.getItem("smartlinkIndex") || "0",
    10
  );

  if (
    Number.isNaN(index) ||
    index < 0 ||
    index >= SMARTLINKS.length
  ) {
    index = 0;
  }

  return index;
}


/* =========================================================
   BUKA SMARTLINK
========================================================= */

function openSmartlink() {

  const validLinks = SMARTLINKS.filter(function(item) {

    return (
      item &&
      typeof item.url === "string" &&
      /^https?:\/\//i.test(item.url)
    );

  });


  if (!validLinks.length) {
    return;
  }


  let index = getSmartlinkIndex();

  if (index >= validLinks.length) {
    index = 0;
  }


  const selected = validLinks[index];


  localStorage.setItem(
    "smartlinkIndex",
    String(
      (index + 1) % validLinks.length
    )
  );


  /*
     Dibuka hanya setelah pengguna
     menekan tombol konfirmasi usia.
  */

  window.open(
    selected.url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* =========================================================
   KONFIRMASI USIA
========================================================= */

let ageConfirmed = false;
let agePopupShown = false;


function showAgeConfirmation() {

  if (ageConfirmed || agePopupShown) {
    return;
  }


  agePopupShown = true;


  const overlay =
    document.createElement("div");

  overlay.id =
    "ageConfirmation";


  overlay.innerHTML = `

    <div class="age-box">

      <div class="age-icon">
        🔞
      </div>

      <h2>
        Konfirmasi Usia
      </h2>

      <p>
        Apakah Anda sudah berusia 18 tahun atau lebih?
      </p>

      <div class="age-buttons">

        <button
          type="button"
          id="ageYes"
        >
          Saya 18+
        </button>

        <button
          type="button"
          id="ageNo"
        >
          Keluar
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    overlay
  );


  const yesButton =
    document.getElementById("ageYes");


  const noButton =
    document.getElementById("ageNo");


  yesButton.addEventListener(
    "click",
    function() {

      ageConfirmed = true;

      overlay.remove();

      openSmartlink();

      playVideo();

    }
  );


  noButton.addEventListener(
    "click",
    function() {

      window.location.href =
        "about:blank";

    }
  );

}


/* =========================================================
   CSS POPUP
========================================================= */

function addAgePopupStyle() {

  if (
    document.getElementById(
      "agePopupStyle"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "agePopupStyle";


  style.textContent = `

    #ageConfirmation {
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0,0,0,.78);
      box-sizing: border-box;
    }

    .age-box {
      width: 100%;
      max-width: 380px;
      padding: 28px 22px;
      border-radius: 16px;
      background: #fff;
      color: #111;
      text-align: center;
      box-sizing: border-box;
      box-shadow: 0 15px 50px rgba(0,0,0,.35);
    }

    .age-icon {
      font-size: 42px;
      margin-bottom: 10px;
    }

    .age-box h2 {
      margin: 0 0 10px;
      font-size: 24px;
    }

    .age-box p {
      margin: 0 0 22px;
      line-height: 1.5;
      color: #555;
    }

    .age-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .age-buttons button {
      flex: 1;
      min-height: 46px;
      border: 0;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }

    #ageYes {
      background: #111;
      color: #fff;
    }

    #ageNo {
      background: #e9e9e9;
      color: #111;
    }

    @media (max-width: 480px) {

      .age-box {
        max-width: 340px;
      }

      .age-buttons {
        flex-direction: column;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   PLAY VIDEO
========================================================= */

function playVideo() {

  const player =
    document.getElementById(
      "videoPlayer"
    );


  if (!player) {
    return;
  }


  const promise =
    player.play();


  if (
    promise &&
    typeof promise.catch ===
    "function"
  ) {

    promise.catch(
      function() {}
    );

  }

}


/* =========================================================
   TIMER 15 DETIK
========================================================= */

function startAgeTimer() {

  const player =
    document.getElementById(
      "videoPlayer"
    );


  if (!player) {
    return;
  }


  let timerStarted = false;


  player.addEventListener(
    "timeupdate",
    function() {

      if (
        ageConfirmed ||
        agePopupShown
      ) {
        return;
      }


      if (
        player.currentTime >= 15 &&
        !timerStarted
      ) {

        timerStarted = true;

        showAgeConfirmation();

      }

    }
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


  startAgeTimer();

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
   POPUNDER ADSTERRA
========================================================= */

function loadPopunder() {

  if (
    document.getElementById(
      "adsterraPopunder"
    )
  ) {
    return;
  }


  const script =
    document.createElement(
      "script"
    );


  script.id =
    "adsterraPopunder";


  script.src =
    "https://conductivebreeds.com/db/79/3a/db793a3e57b74080ac30338894ba8a75.js";


  script.async =
    true;


  document.body.appendChild(
    script
  );

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    addAgePopupStyle();

    loadPopunder();

    loadVideos();

  }
);
