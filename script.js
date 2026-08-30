/* =========================================================
   KUMPULAN VIDEO VIRAL
   SCRIPT.JS FINAL
   ---------------------------------------------------------
   VIDEO:
   videos.json
   format:
   id + title + url + description

   IKLAN:
   Adsterra → Kadam → Monetag

   IKLAN DIBUKA:
   Hanya ketika tombol "Tonton Video" diklik

   COOLDOWN:
   60 detik
========================================================= */


/* =========================================================
   PENGATURAN IKLAN
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
   COOLDOWN IKLAN
========================================================= */

const AD_COOLDOWN = 60 * 1000;

const AD_TIME_KEY = "lastAdTime";

const AD_INDEX_KEY = "adIndex";


/* =========================================================
   AMBIL INDEX IKLAN
========================================================= */

function getAdIndex() {

  let index = parseInt(
    localStorage.getItem(AD_INDEX_KEY) || "0",
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
   CEK COOLDOWN
========================================================= */

function canOpenAd() {

  const lastTime = parseInt(
    localStorage.getItem(AD_TIME_KEY) || "0",
    10
  );

  const now = Date.now();

  return (
    now - lastTime >= AD_COOLDOWN
  );

}


/* =========================================================
   OPEN AD
========================================================= */

function openAd() {

  /*
    Cek cooldown.
    Jika belum 60 detik,
    iklan tidak dibuka lagi.
  */

  if (!canOpenAd()) {

    return false;

  }


  /*
    Ambil link iklan yang valid.
  */

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


  /*
    Ambil index iklan.
  */

  let index = getAdIndex();


  if (index >= validLinks.length) {

    index = 0;

  }


  const selected =
    validLinks[index];


  /*
    Simpan iklan berikutnya.

    0 = Adsterra
    1 = Kadam
    2 = Monetag
  */

  localStorage.setItem(
    AD_INDEX_KEY,
    String(
      (index + 1) %
      validLinks.length
    )
  );


  /*
    Simpan waktu iklan terakhir.
  */

  localStorage.setItem(
    AD_TIME_KEY,
    String(Date.now())
  );


  /*
    Buka iklan pada tab baru.
    Pemanggilan terjadi dari klik user.
  */

  const newWindow =
    window.open(
      selected.url,
      "_blank",
      "noopener,noreferrer"
    );


  /*
    Jika browser memblokir popup.
  */

  if (!newWindow) {

    return false;

  }


  return true;

}


/* =========================================================
   LOAD VIDEOS.JSON
========================================================= */

async function loadVideos() {

  try {

    const response =
      await fetch(
        "videos.json?v=" +
        Date.now(),
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "videos.json tidak ditemukan. HTTP " +
        response.status
      );

    }


    const data =
      await response.json();


    /*
      videos.json wajib berupa array.
    */

    if (!Array.isArray(data)) {

      throw new Error(
        "Format videos.json tidak valid."
      );

    }


    /*
      Normalisasi data video.

      Format utama:
      id
      title
      url
      description

      "file" juga diterima sebagai
      fallback supaya data lama
      tidak langsung rusak.
    */

    const videos =
      data
        .map(function(video, index) {

          if (!video) {

            return null;

          }


          return {

            id:
              video.id ??
              index + 1,

            title:
              video.title ||
              "Video Viral",

            url:
              video.url ||
              video.file ||
              "",

            description:
              video.description ||
              "Selamat menonton."

          };

        })

        .filter(function(video) {

          return (
            video &&
            typeof video.url === "string" &&
            video.url.trim() !== ""
          );

        });


    /*
      Pastikan video tersedia.
    */

    if (!videos.length) {

      throw new Error(
        "Tidak ada video yang tersedia."
      );

    }


    /*
      Tampilkan daftar video
      jika berada di index.html.
    */

    renderVideoList(videos);


    /*
      Tampilkan player
      jika berada di player.html.
    */

    renderPlayer(videos);

  }

  catch (error) {

    console.error(
      "Gagal memuat videos.json:",
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

          <br><br>

          Pastikan file
          <strong>videos.json</strong>
          berada di folder yang sama
          dengan index.html.

        </div>

      `;

    }


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
        "Video tidak dapat dimuat";

    }


    if (description) {

      description.textContent =
        "Periksa file videos.json.";

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


  /*
    Kalau bukan halaman index,
    hentikan fungsi.
  */

  if (!container) {

    return;

  }


  container.innerHTML = "";


  videos.forEach(
    function(video) {

      /*
        Pastikan URL ada.
      */

      if (
        !video ||
        !video.url
      ) {

        return;

      }


      const card =
        document.createElement("a");


      card.className =
        "video-card";


      /*
        ID video digunakan
        untuk player.html.
      */

      card.href =
        "player.html?id=" +
        encodeURIComponent(
          video.id
        );


      /*
        Semua isi card dibuat
        menggunakan DOM supaya
        lebih aman.
      */

      const thumb =
        document.createElement("div");


      thumb.className =
        "thumb";


      const preview =
        document.createElement("video");


      preview.src =
        video.url;


      preview.muted = true;

      preview.playsInline = true;

      preview.preload =
        "metadata";

      preview.setAttribute(
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
        preview
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
        video.title;


      const meta =
        document.createElement("div");


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


  /*
    Jika tidak ada video.
  */

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


  /*
    Kalau bukan player.html,
    hentikan fungsi.
  */

  if (!player) {

    return;

  }


  /*
    Ambil parameter ID
    dari URL.

    Contoh:

    player.html?id=151
  */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const requestedId =
    params.get("id");


  /*
    Cari video berdasarkan ID.
  */

  let video =
    videos.find(
      function(item) {

        return (
          String(item.id) ===
          String(requestedId)
        );

      }
    );


  /*
    Jika ID tidak ditemukan,
    gunakan video pertama.
  */

  if (!video) {

    video = videos[0];

  }


  if (
    !video ||
    !video.url
  ) {

    showPlayerError();

    return;

  }


  /*
    Pasang URL video.
  */

  player.src =
    video.url;


  player.preload =
    "metadata";


  /*
    Judul.
  */

  const title =
    document.getElementById(
      "videoTitle"
    );


  if (title) {

    title.textContent =
      video.title;

  }


  /*
    Deskripsi.
  */

  const description =
    document.getElementById(
      "videoDescription"
    );


  if (description) {

    description.textContent =
      video.description;

  }


  /*
    Judul halaman.
  */

  document.title =
    video.title +
    " - KUMPULAN VIDEO VIRAL";


  /*
    Related videos.
  */

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
    document.getElementById(
      "relatedVideos"
    );


  if (!container) {

    return;

  }


  container.innerHTML = "";


  /*
    Ambil maksimal 6 video
    selain video yang sedang dibuka.
  */

  const related =
    videos
      .filter(function(video) {

        return (
          String(video.id) !==
          String(currentId)
        );

      })
      .slice(0, 6);


  related.forEach(
    function(video) {

      const link =
        document.createElement("a");


      link.className =
        "related-card";


      link.href =
        "player.html?id=" +
        encodeURIComponent(
          video.id
        );


      link.textContent =
        "▶ " +
        video.title;


      container.appendChild(
        link
      );

    }
  );

}


/* =========================================================
   TOMBOL TONTON VIDEO
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
      Iklan hanya dicoba
      setelah user menekan
      tombol Tonton Video.
    */

    openAd();


    /*
      Jalankan video.
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


    /*
      Beberapa browser mengembalikan
      Promise dari play().
    */

    if (
      playPromise &&
      typeof playPromise.catch ===
      "function"
    ) {

      playPromise.catch(
        function(error) {

          console.log(
            "Video belum dapat diputar:",
            error
          );

        }
      );

    }


    /*
      Tombol tetap tersedia.
      Tidak dipaksa hilang.
    */

  }
);


/* =========================================================
   ERROR PLAYER
========================================================= */

function showPlayerError() {

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
      "Video tidak ditemukan";

  }


  if (description) {

    description.textContent =
      "Video yang diminta tidak tersedia.";

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
