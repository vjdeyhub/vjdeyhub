/* =========================================================
   KUMPULAN VIDEO VIRAL
   AD LINK ROTATION
   Adsterra → Kadam → Monetag
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
   AMBIL INDEX IKLAN
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
   OPEN AD
========================================================= */

function openAd() {

  const now = Date.now();

  /*
    Cooldown supaya satu user
    tidak terus membuka iklan.
  */

  if (now - lastAdTime < AD_COOLDOWN) {
    return false;
  }


  const validLinks = AD_LINKS.filter(function(item) {

    return (
      item &&
      typeof item.url === "string" &&
      /^https?:\/\//i.test(item.url)
    );

  });


  if (!validLinks.length) {
    return false;
  }


  let index = getAdIndex();

  /*
    Pastikan index tetap valid
    jika jumlah link berubah.
  */

  if (index >= validLinks.length) {
    index = 0;
  }


  const selected =
    validLinks[index];


  /*
    Simpan iklan berikutnya.

    Urutan:

    0 = Adsterra
    1 = Kadam
    2 = Monetag
  */

  localStorage.setItem(
    "adIndex",
    String(
      (index + 1) % validLinks.length
    )
  );


  lastAdTime = now;


  /*
    Membuka tab baru dari
    interaksi pengguna.
  */

  const newWindow =
    window.open(
      selected.url,
      "_blank",
      "noopener,noreferrer"
    );


  /*
    Beberapa browser dapat
    memblokir popup/tab.
  */

  if (!newWindow) {
    return false;
  }


  return true;
}


/* =========================================================
   LOAD VIDEOS
========================================================= */

async function loadVideos() {

  try {

    const response =
      await fetch(
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


    const videos =
      await response.json();


    if (!Array.isArray(videos)) {

      throw new Error(
        "Format videos.json tidak valid."
      );

    }


    renderVideoList(videos);

    renderPlayer(videos);

  }

  catch (error) {

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
          Silakan coba lagi.
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
        !video.file
      ) {
        return;
      }


      const card =
        document.createElement("a");


      card.className =
        "video-card";


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
            ${escapeHtml(
              video.title ||
              "Video Viral"
            )}
          </div>

          <div class="card-meta">
            Video #${index + 1}
          </div>

        </div>

      `;


      container.appendChild(card);

    }
  );


  if (!container.children.length) {

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
    parseInt(id, 10);


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
    !video.file
  ) {

    return;

  }


  player.src =
    video.file;


  player.preload =
    "metadata";


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
      video.title ||
      "Video Viral";

  }


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


  videos
    .map(function(video, index) {

      return {
        video: video,
        index: index
      };

    })


    .filter(function(item) {

      return (
        item.index !==
        currentIndex
      );

    })


    .slice(0, 6)


    .forEach(function(item) {

      const link =
        document.createElement("a");


      link.className =
        "related-card";


      link.href =
        "player.html?id=" +
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

    });

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


    /*
      Iklan hanya dipicu oleh
      klik tombol Tonton.
    */

    openAd();


    /*
      Setelah interaksi user,
      video dijalankan.
    */

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
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

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
