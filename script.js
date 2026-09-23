const MONETAG_DIRECTLINK = "https://omg10.com/4/11840997";
const VIDEOS_URL = "./videos.json";

let allVideos = [];

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function openDirectlink() {
    window.open(MONETAG_DIRECTLINK, "_blank");
}

async function getVideos() {
    const response = await fetch(VIDEOS_URL + "?v=" + Date.now(), {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("videos.json gagal dimuat (" + response.status + ")");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Format videos.json tidak valid.");
    }

    return data.filter(item =>
        item &&
        typeof item.file === "string" &&
        item.file.trim() !== ""
    );
}

function getVideoId(video, index) {
    return encodeURIComponent(String(index + 1));
}

function renderVideoList(videos) {
    const list = document.getElementById("videoList");
    if (!list) return;

    if (!videos.length) {
        list.innerHTML = '<div class="error">Tidak ada video yang tersedia.</div>';
        return;
    }

    list.innerHTML = videos.map((video, index) => `
        <article class="video-card" data-index="${index}">
            <div class="thumbnail">
                <video
                    src="${escapeHTML(video.file)}"
                    muted
                    playsinline
                    preload="metadata">
                </video>
                <div class="play-icon">▶</div>
            </div>

            <div class="video-card-content">
                <h2>${escapeHTML(video.title || "Video Viral")}</h2>
                <p>Klik untuk menonton video ini.</p>
            </div>
        </article>
    `).join("");

    list.querySelectorAll(".video-card").forEach(card => {
        card.addEventListener("click", () => {
            const index = Number(card.dataset.index);
            openDirectlink();

            setTimeout(() => {
                window.location.href = "player.html?id=" + getVideoId(videos[index], index);
            }, 250);
        });
    });
}

function renderRelated(videos, currentIndex) {
    const container = document.getElementById("relatedVideos");
    if (!container) return;

    const related = videos
        .map((video, index) => ({ video, index }))
        .filter(item => item.index !== currentIndex)
        .slice(0, 12);

    container.innerHTML = related.map(({ video, index }) => `
        <article class="related-video" data-index="${index}">
            <div class="related-thumb">
                <video
                    src="${escapeHTML(video.file)}"
                    muted
                    playsinline
                    preload="metadata">
                </video>
                <div class="play-icon small">▶</div>
            </div>
            <h3>${escapeHTML(video.title || "Video Viral")}</h3>
        </article>
    `).join("");

    container.querySelectorAll(".related-video").forEach(card => {
        card.addEventListener("click", () => {
            const index = Number(card.dataset.index);
            openDirectlink();

            setTimeout(() => {
                window.location.href = "player.html?id=" + encodeURIComponent(String(index + 1));
            }, 250);
        });
    });
}

async function loadHome() {
    const list = document.getElementById("videoList");
    if (!list) return;

    try {
        allVideos = await getVideos();
        renderVideoList(allVideos);
    } catch (error) {
        console.error(error);
        list.innerHTML = `
            <div class="error">
                Gagal memuat video.<br>
                <small>${escapeHTML(error.message)}</small>
            </div>
        `;
    }
}

async function loadPlayer() {
    const player = document.getElementById("videoPlayer");
    if (!player) return;

    const title = document.getElementById("videoTitle");
    const description = document.getElementById("videoDescription");

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    try {
        allVideos = await getVideos();

        if (!Number.isInteger(id) || id < 1 || id > allVideos.length) {
            throw new Error("Video tidak ditemukan.");
        }

        const index = id - 1;
        const video = allVideos[index];

        player.src = video.file;
        player.load();

        if (title) {
            title.textContent = video.title || "Video Viral";
        }

        if (description) {
            description.textContent = "Tonton video sampai selesai.";
        }

        renderRelated(allVideos, index);

        player.addEventListener("error", () => {
            if (description) {
                description.textContent = "Video gagal diputar. Coba pilih video lainnya.";
            }
        }, { once: true });

    } catch (error) {
        console.error(error);

        if (title) {
            title.textContent = "Video tidak ditemukan";
        }

        if (description) {
            description.textContent = error.message;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadHome();
    loadPlayer();
});
