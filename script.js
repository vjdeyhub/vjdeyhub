/* =========================================================
   KUMPULAN VIDEO VIRAL
   SCRIPT FINAL
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
   BUKA IKLAN
========================================================= */

function openAd() {

  const now = Date.now();

  /*
    Mencegah iklan dibuka
    berkali-kali dalam waktu singkat.
  */

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
        /^https?:\/\//i.test(
          item.url.trim()
        )
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


  /*
    Simpan iklan berikutnya.
    
    Adsterra
       ↓
    Kadam
       ↓
    Monetag
       ↓
    kembali Adsterra
  */

  localStorage.setItem(
    "adIndex",
    String(
      (index + 1) %
      validLinks.length
    )
  );


  lastAdTime =
    now;


  /*
    Popup dibuka hanya
    setelah interaksi pengguna.
  */

  const newWindow =
    window.open(
      selected.url,
      "_blank",
      "noopener,noreferrer"
    );


  return !!newWindow;
}


/* =========================================================
   NORMALISASI DATA VIDEO
========================================================= */

function normalizeVideo(
  video,
  index
) {

  if (
    !video ||
    typeof video !== "object"
  ) {
    return null;
  }


  /*
    Mendukung:

    url
    atau

    file
  */

  const videoUrl =
    typeof video.url === "string" &&
    video.url.trim()
      ? video.url.trim()
      : (
          typeof video.file === "string"
            ? video.file.trim()
            : ""
        );


  if (!videoUrl) {
    return null;
  }


  /*
    ID:

    Kalau ada ID valid,
    gunakan ID tersebut.

    Kalau tidak ada,
    gunakan nomor array + 1.
  */

  let videoId =
    parseInt(
      video.id,
      10
    );


  if (
    Number.isNaN(videoId) ||
    videoId < 1
  ) {
    videoId =
      index + 1;
  }


  return {

    id: videoId,

    title:
      typeof video.title === "string" &&
      video.title.trim()
        ? video.title.trim()
        : "Video Viral",

    url:
      videoUrl,

    description:
      typeof video.description === "string" &&
      video.description.trim()
        ? video.description.trim()
        : "Selamat menonton."

  };

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


    const rawVideos =
      await response.json();


    if (
      !Array.isArray(
        rawVideos
      )
    ) {

      throw new Error(
        "videos.json harus berupa array."
      );

    }


    const videos =
      rawVideos
        .map(
          function(video, index) {

            return normalizeVideo(
              video,
              index
            );

          }
        )
        .filter(
          function(video) {

            return video !== null;

          }
        );


    if (!videos.length) {

      throw new Error(
        "Tidak ada video valid di videos.json."
      );

    }


    /*
      Simpan data video
      supaya bisa dipakai
      halaman player.
    */

    window.VIDEO_DATA =
      videos;


    renderVideoList(
      videos
    );


    renderPlayer(
      videos
    );

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
          Pastikan file
          <strong>videos.json</strong>
          berada satu folder dengan
          <strong>index.html</strong>.
        </div>
      `;

    }


    const player =
      document.getElementById(
        "videoPlayer"
      );


    if (player) {

      showPlayerError(
        "Data video tidak dapat dimuat. Periksa videos.json."
      );

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


  container.innerHTML =
    "";


  videos.forEach(
    function(video) {

      if (
        !video ||
        !video.url
      ) {
        return;
      }


      const card =
        document.createElement(
          "a"
        );


      card.className =
        "video-card";


      /*
        ID dibuat berdasarkan
        ID video sebenarnya.

        Contoh:

        player.html?id=1
        player.html?id=200
      */

      card.href =
        "./player.html?id=" +
        encodeURIComponent(
          video.id
        );


      /* =========================
         THUMB
      ========================== */

      const thumb =
        document.createElement(
          "div"
        );


      thumb.className =
        "thumb";


      const videoElement =
        document.createElement(
          "video"
        );


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


      /*
        Jangan autoplay thumbnail.
      */


      const playIcon =
        document.createElement(
          "div"
        );


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
        document.createElement(
          "div"
        );


      content.className =
        "card-content";


      const title =
        document.createElement(
          "div"
        );


      title.className =
        "card-title";


      title.textContent =
        video.title;


      const meta =
        document.createElement(
          "div"
        );


      meta.className =
        "card-meta";


      meta.textContent =
        "Video #" +
        video.id;


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
   CARI VIDEO BERDASARKAN ID
========================================================= */

function findVideoById(
  videos,
  requestedId
) {

  const id =
    parseInt(
      requestedId,
      10
    );


  if (
    Number.isNaN(id)
  ) {
    return null;
  }


  const found =
    videos.find(
      function(video) {

        return (
          Number(video.id) ===
          id
        );

      }
    );


  return found || null;
}


/* =========================================================
   CARI INDEX VIDEO
========================================================= */

function findVideoIndex(
  videos,
  requestedId
) {

  const id =
    parseInt(
      requestedId,
      10
    );


  if (
    Number.isNaN(id)
  ) {
    return -1;
  }


  return videos.findIndex(
    function(video) {

      return (
        Number(video.id) ===
        id
      );

    }
  );

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


  /*
    Kalau bukan halaman player,
    hentikan fungsi.
  */

  if (!player) {
    return;
  }


  const params =
    new URLSearchParams(
      window.location.search
    );


  let requestedId =
    params.get("id");


  /*
    Kalau tidak ada ID,
    tampilkan video pertama.
  */

  if (!requestedId) {

    requestedId =
      videos[0].id;

  }


  let index =
    findVideoIndex(
      videos,
      requestedId
    );


  /*
    ID tidak ditemukan:
    gunakan video pertama.
  */

  if (
    index < 0
  ) {

    index = 0;

  }


  const video =
    videos[index];


  if (
    !video ||
    !video.url
  ) {

    showPlayerError(
      "Video tidak ditemukan."
    );

    return;
  }


  /* =========================
     SET PLAYER
  ========================== */

  player.src =
    video.url;


  player.preload =
    "metadata";


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
      video.title;

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
      video.description;

  }


  /* =========================
     DOCUMENT TITLE
  ========================== */

  document.title =
    video.title +
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
      .slice(
        0,
        6
      );


  related.forEach(
    function(item) {

      if (
        !item.video ||
        !item.video.url
      ) {
        return;
      }


      const link =
        document.createElement(
          "a"
        );


      link.className =
        "related-card";


      link.href =
        "./player.html?id=" +
        encodeURIComponent(
          item.video.id
        );


      link.textContent =
        "▶ " +
        item.video.title;


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

  const player =
    document.getElementById(
      "videoPlayer"
    );


  const title =
    document.getElementById(
      "videoTitle"
    );


  const description =
    document.getElementById(
      "videoDescription"
    );


  if (player) {

    player.removeAttribute(
      "src"
    );

    player.load();

  }


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


    /*
      Cegah klik ganda
      terlalu cepat.
    */

    if (
      button.dataset.busy ===
      "1"
    ) {
      return;
    }


    button.dataset.busy =
      "1";


    /*
      Buka iklan hanya
      dari klik pengguna.
    */

    openAd();


    /* =========================
       PLAY VIDEO
    ========================== */

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
          function(error) {

            console.warn(
              "Video belum dapat diputar:",
              error
            );

          }
        );

      }

    }


    /*
      Aktifkan kembali tombol
      setelah beberapa saat.
    */

    setTimeout(
      function() {

        button.dataset.busy =
          "0";

      },
      1000
    );

  }
);


/* =========================================================
   HANDLE ERROR VIDEO
========================================================= */

document.addEventListener(
  "error",
  function(event) {

    const element =
      event.target;


    if (
      element &&
      element.tagName ===
      "VIDEO"
    ) {

      console.warn(
        "Video gagal dimuat:",
        element.src
      );

    }

  },
  true
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
