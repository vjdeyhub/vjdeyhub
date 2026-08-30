document.addEventListener("DOMContentLoaded", function () {

  const videoList = document.getElementById("videoList");

  if (!videoList) {
    return;
  }

  fetch("./videos.json", {
    cache: "no-store"
  })
    .then(function (response) {

      if (!response.ok) {
        throw new Error(
          "videos.json tidak ditemukan. Status: " + response.status
        );
      }

      return response.json();
    })

    .then(function (videos) {

      videoList.innerHTML = "";

      if (!Array.isArray(videos) || videos.length === 0) {

        videoList.innerHTML = `
          <div class="loading">
            Tidak ada video yang tersedia.
          </div>
        `;

        return;
      }

      videos.forEach(function (video, index) {

        /*
         * Mendukung format:
         * url
         * maupun file
         *
         * Tetapi format utama kita tetap menggunakan url.
         */

        const videoUrl = video.url || video.file;

        if (!videoUrl) {
          return;
        }

        const id = video.id || (index + 1);

        const title =
          video.title ||
          "Video pilihan";

        const description =
          video.description ||
          "Video pilihan untuk kamu tonton.";

        const card = document.createElement("article");

        card.className = "video-card";

        card.innerHTML = `
          <a
            href="video.html?id=${encodeURIComponent(id)}"
            class="video-link"
          >

            <div class="video-preview">

              <video
                src="${escapeHTML(videoUrl)}"
                preload="metadata"
                muted
                playsinline
              ></video>

              <div class="play-icon">
                ▶
              </div>

            </div>

            <div class="video-info">

              <h3>
                ${escapeHTML(title)}
              </h3>

              <p>
                ${escapeHTML(description)}
              </p>

            </div>

          </a>
        `;

        videoList.appendChild(card);

      });

      if (videoList.children.length === 0) {

        videoList.innerHTML = `
          <div class="loading">
            Tidak ada video yang tersedia.
          </div>
        `;

      }

    })

    .catch(function (error) {

      console.error("Gagal memuat videos.json:", error);

      videoList.innerHTML = `
        <div class="loading">
          Gagal memuat video.
          <br>
          <small>
            Pastikan file <b>videos.json</b> berada di folder yang sama dengan index.html.
          </small>
        </div>
      `;

    });

});


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
