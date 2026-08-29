document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("videoGrid");
  const searchBtn = document.querySelector(".search-btn");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");

  let videos = [];

  searchBtn.addEventListener("click", () => {

    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
      searchInput.focus();
    }

  });

  fetch("videos.json", {
    cache: "no-cache"
  })
  .then(response => {

    if (!response.ok) {
      throw new Error("videos.json tidak ditemukan");
    }

    return response.json();

  })
  .then(data => {

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Tidak ada video");
    }

    videos = data;

    shuffle(videos);

    render(videos);

    searchInput.addEventListener("input", () => {

      const keyword =
        searchInput.value.trim().toLowerCase();

      const filtered = videos.filter(video =>
        String(video.title)
          .toLowerCase()
          .includes(keyword)
      );

      render(filtered);

    });

  })
  .catch(error => {

    console.error(error);

    grid.innerHTML = `
      <div class="loading">
        Gagal memuat video.
      </div>
    `;

  });

  function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

      const j =
        Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] =
      [array[j], array[i]];

    }

  }

  function render(data) {

    grid.innerHTML = "";

    if (data.length === 0) {

      grid.innerHTML = `
        <div class="loading">
          Video tidak ditemukan.
        </div>
      `;

      return;
    }

    data.forEach((video, index) => {

      const card = document.createElement("a");

      card.className = "video-card";

      /*
       * Menggunakan index dari array yang sudah diacak.
       * Data tersebut dikirim melalui URL sebagai ID.
       */
      const originalIndex =
        videos.indexOf(video);

      card.href =
        "player.html?id=" + originalIndex;

      const thumbnail =
        document.createElement("div");

      thumbnail.className = "thumbnail";

      const preview =
        document.createElement("video");

      preview.src = video.file;
      preview.preload = "metadata";
      preview.muted = true;
      preview.playsInline = true;

      const hd =
        document.createElement("span");

      hd.className = "hd-badge";
      hd.textContent = "HD";

      const time =
        document.createElement("span");

      time.className = "duration";
      time.textContent = "--:--";

      preview.addEventListener(
        "loadedmetadata",
        () => {

          if (Number.isFinite(preview.duration)) {

            time.textContent =
              formatTime(preview.duration);

          }

        }
      );

      const title =
        document.createElement("div");

      title.className = "card-title";
      title.textContent = video.title;

      thumbnail.appendChild(preview);
      thumbnail.appendChild(hd);
      thumbnail.appendChild(time);

      card.appendChild(thumbnail);
      card.appendChild(title);

      grid.appendChild(card);

    });

  }

  function formatTime(seconds) {

    seconds = Math.floor(seconds);

    const minutes =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return minutes + ":" +
      String(secs).padStart(2, "0");

  }

});
