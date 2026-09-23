// ==========================================
// KUMPULAN VIDEO VIRAL
// SCRIPT.JS
// ==========================================

// Monetag Directlink
const MONETAG_DIRECTLINK = "https://omg10.com/4/11840997";

let videos = [];


// ==========================================
// MONETAG DIRECTLINK
// ==========================================

function openDirectlink() {
    try {
        window.open(
            MONETAG_DIRECTLINK,
            "_blank",
            "noopener,noreferrer"
        );
    } catch (error) {
        console.error("Directlink error:", error);
    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {
    if (text === undefined || text === null) {
        return "";
    }

    const div = document.createElement("div");
    div.textContent = String(text);

    return div.innerHTML;
}


// ==========================================
// LOAD VIDEOS.JSON
// ==========================================

async function loadVideos() {

    const videoList = document.getElementById("videoList");

    if (!videoList) {
        console.error("Element #videoList tidak ditemukan.");
        return;
    }

    videoList.innerHTML = `
        <div style="
            width:100%;
            padding:40px 20px;
            text-align:center;
            color:#aaa;
        ">
            Memuat video...
        </div>
    `;

    try {

        const response = await fetch(
            "videos.json?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        console.log(
            "videos.json status:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                "videos.json tidak ditemukan. HTTP " +
                response.status
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "Format videos.json tidak valid."
            );
        }

        videos = data.filter(video =>
            video &&
            video.id !== undefined &&
            video.url
        );

        console.log(
            "Jumlah video berhasil dimuat:",
            videos.length
        );

        if (videos.length === 0) {

            videoList.innerHTML = `
                <div style="
                    width:100%;
                    padding:40px 20px;
                    text-align:center;
                    color:#aaa;
                ">
                    Belum ada video.
                </div>
            `;

            return;
        }

        renderVideoList();

    } catch (error) {

        console.error(
            "Gagal memuat videos.json:",
            error
        );

        videoList.innerHTML = `
            <div style="
                width:100%;
                padding:40px 20px;
                text-align:center;
                color:#ff5555;
            ">
                <div style="
                    font-size:40px;
                    margin-bottom:12px;
                ">
                    ⚠️
                </div>

                <div style="
                    font-size:17px;
                    font-weight:bold;
                    margin-bottom:8px;
                ">
                    Video gagal dimuat
                </div>

                <div style="
                    font-size:12px;
                    color:#888;
                    word-break:break-word;
                ">
                    ${escapeHTML(error.message)}
                </div>
            </div>
        `;
    }
}


// ==========================================
// RENDER VIDEO LIST
// ==========================================

function renderVideoList() {

    const videoList =
        document.getElementById("videoList");

    if (!videoList) return;

    videoList.innerHTML = "";

    videos.forEach((video) => {

        const card =
            document.createElement("div");

        card.className = "video-card";

        card.innerHTML = `

            <div class="video-thumbnail">

                <video
                    src="${escapeHTML(video.url)}"
                    muted
                    playsinline
                    preload="metadata"
                ></video>

                <div class="play-button">
                    ▶
                </div>

            </div>

            <div class="video-info">

                <h3>
                    ${escapeHTML(video.title)}
                </h3>

                <p>
                    ${escapeHTML(video.description || "")}
                </p>

            </div>
        `;


        // ==================================
        // KLIK VIDEO
        // ==================================

        card.addEventListener(
            "click",
            function () {

                // Buka Monetag Directlink
                openDirectlink();

                // Buka halaman player
                setTimeout(function () {

                    window.location.href =
                        "player.html?id=" +
                        encodeURIComponent(video.id);

                }, 300);

            }
        );


        videoList.appendChild(card);

    });
}


// ==========================================
// PLAYER
// ==========================================

async function renderPlayer() {

    const player =
        document.getElementById("videoPlayer");

    if (!player) return;

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id = params.get("id");

    if (!id) {

        console.error(
            "ID video tidak ditemukan."
        );

        return;
    }


    try {

        const response = await fetch(
            "videos.json?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "videos.json HTTP " +
                response.status
            );

        }

        const data =
            await response.json();


        const video =
            data.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!video) {

            console.error(
                "Video dengan ID " +
                id +
                " tidak ditemukan."
            );

            return;
        }


        // Pasang video
        player.src = video.url;

        player.load();


        // Judul
        const title =
            document.getElementById(
                "videoTitle"
            );

        if (title) {

            title.textContent =
                video.title || "Video Viral";

        }


        // Deskripsi
        const description =
            document.getElementById(
                "videoDescription"
            );

        if (description) {

            description.textContent =
                video.description || "";

        }


        // ==================================
        // VIDEO RELATED
        // ==================================

        renderRelated(
            data,
            video.id
        );


    } catch (error) {

        console.error(
            "Player error:",
            error
        );

    }
}


// ==========================================
// RELATED VIDEOS
// ==========================================

function renderRelated(
    data,
    currentId
) {

    const relatedContainer =
        document.getElementById(
            "relatedVideos"
        );

    if (!relatedContainer) return;


    const related =
        data.filter(
            video =>
                String(video.id) !==
                String(currentId)
        );


    relatedContainer.innerHTML = "";


    related.forEach(video => {

        const item =
            document.createElement("div");

        item.className =
            "related-video";


        item.innerHTML = `

            <div class="related-thumb">

                <video
                    src="${escapeHTML(video.url)}"
                    muted
                    playsinline
                    preload="metadata"
                ></video>

                <span class="related-play">
                    ▶
                </span>

            </div>

            <div class="related-info">

                <h4>
                    ${escapeHTML(video.title)}
                </h4>

                <p>
                    ${escapeHTML(
                        video.description || ""
                    )}
                </p>

            </div>

        `;


        item.addEventListener(
            "click",
            function () {

                openDirectlink();

                setTimeout(function () {

                    window.location.href =
                        "player.html?id=" +
                        encodeURIComponent(
                            video.id
                        );

                }, 300);

            }
        );


        relatedContainer.appendChild(item);

    });

}


// ==========================================
// SEARCH VIDEO
// ==========================================

function searchVideos(keyword) {

    const videoList =
        document.getElementById(
            "videoList"
        );

    if (!videoList) return;


    const query =
        String(keyword || "")
        .trim()
        .toLowerCase();


    if (!query) {

        renderVideoList();
        return;

    }


    const results =
        videos.filter(video => {

            const title =
                String(
                    video.title || ""
                ).toLowerCase();

            const description =
                String(
                    video.description || ""
                ).toLowerCase();

            return (
                title.includes(query) ||
                description.includes(query)
            );

        });


    videoList.innerHTML = "";


    if (results.length === 0) {

        videoList.innerHTML = `
            <div style="
                width:100%;
                padding:40px 20px;
                text-align:center;
                color:#aaa;
            ">
                Video tidak ditemukan.
            </div>
        `;

        return;
    }


    results.forEach(video => {

        const card =
            document.createElement("div");

        card.className =
            "video-card";


        card.innerHTML = `

            <div class="video-thumbnail">

                <video
                    src="${escapeHTML(video.url)}"
                    muted
                    playsinline
                    preload="metadata"
                ></video>

                <div class="play-button">
                    ▶
                </div>

            </div>

            <div class="video-info">

                <h3>
                    ${escapeHTML(video.title)}
                </h3>

                <p>
                    ${escapeHTML(
                        video.description || ""
                    )}
                </p>

            </div>

        `;


        card.addEventListener(
            "click",
            function () {

                openDirectlink();

                setTimeout(function () {

                    window.location.href =
                        "player.html?id=" +
                        encodeURIComponent(
                            video.id
                        );

                }, 300);

            }
        );


        videoList.appendChild(card);

    });

}


// ==========================================
// SEARCH INPUT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "KUMPULAN VIDEO VIRAL - SCRIPT AKTIF"
        );


        // Halaman index
        if (
            document.getElementById(
                "videoList"
            )
        ) {

            loadVideos();

        }


        // Halaman player
        if (
            document.getElementById(
                "videoPlayer"
            )
        ) {

            renderPlayer();

        }


        // Search
        const searchInput =
            document.getElementById(
                "searchInput"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    searchVideos(
                        this.value
                    );

                }
            );

        }

    }
);
