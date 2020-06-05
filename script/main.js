const IMAGE_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const API_KEY = "5fa533a743045e934dc1d08cfe2d7520";
const SERVER_PATH = "https://api.themoviedb.org/3";

// main ui elements
const leftMenu = document.querySelector(".left-menu"),
    hamburger = document.querySelector(".hamburger"),
    cardsList = document.querySelector(".cards__list"),
    modal = document.querySelector(".modal"),
    searchForm = document.querySelector(".search__form"),
    searchInput = document.querySelector(".search__form-input"),
    outputTextInfo = document.querySelector(".cards__head"),
    paginator = document.querySelector(".pagination-btn"),
    upBtn = document.querySelector(".btn-up"),
    dropdowns = document.querySelectorAll(".dropdown"),
    fastSearchBtn = document.querySelector(".btn-fast-search"),
    titleWrapper = document.querySelector(".title-wrapper"),
    detailedSearchBtn = document.querySelector(".btn-detailed-search"),
    detailedSearchBtnContainer = document.querySelector(".btn-container"),
    detailedSearchBlock = document.querySelector(".detailed-search"),
    detailedSearchCancel = document.querySelector(".btn-detailed-search-cancel");

// film card elements
const cardImg = document.querySelector(".card__img"),
    title = document.querySelector(".modal__title"),
    genresList = document.querySelector(".genres-list"),
    rating = document.querySelector(".rating"),
    description = document.querySelector(".description"),
    modalLink = document.querySelector(".modal__link");

const loading = document.createElement("div");
loading.className = "loading";

const clientHeight = document.documentElement.clientHeight;

const cardRendererUnit = new CardRenderer();
const dbServiceUnit = new DBService();

let nextPage = 1;

function showLoading() {
    cardsList.append(loading);
}

function smoothToTop() {
    window.scrollTo({top: 0, behavior: "smooth"});
}

// get search value, get response for API and then render card if response is correct
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = searchInput.value;
    searchInput.value = "";
    if (value) {
        showLoading();
        outputTextInfo.textContent = "Результаты поиска:";
        dbServiceUnit.getSearchResults(value, undefined).then(cardRendererUnit.renderCards);
    }
});

fastSearchBtn.addEventListener("click", (event) => {
    searchForm.submit = true;
});


//========================================================
function loadDefault() {
    showLoading()
    dbServiceUnit.getTrendingDay().then(cardRendererUnit.renderCards).then(() => {
        outputTextInfo.textContent = "Популярно сегодня:";
    });
}

loadDefault();
//========================================================

// show detailed search params on click
detailedSearchBtn.addEventListener("click", (event) => {
    detailedSearchBlock.style.display="inherit";
    detailedSearchBtnContainer.style.display = "none";
});

// load start page
detailedSearchCancel.addEventListener("click", (event) => {
    detailedSearchBlock.style.display="none";
    detailedSearchBtnContainer.style.display = "flex";
});

// left bar opening
hamburger.addEventListener("click", () => {
    leftMenu.classList.toggle("openMenu");
    hamburger.classList.toggle("open");
});

// left bar closing
document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest(".left-menu")) {
        leftMenu.classList.remove("openMenu");
        hamburger.classList.remove("open");
        dropdowns.forEach(item => {
            item.classList.remove("active");
        });
    }
});

// dropdown in left bar opening & top/popular search
leftMenu.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest(".dropdown");
    if (dropdown) {
        dropdown.classList.toggle("active");
        leftMenu.classList.add("openMenu");
        hamburger.classList.add("open");
    }

    if (target.closest("#trending-day")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getTrendingDay().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Популярно сегодня:";
        });
    } else if (target.closest("#trending-week")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getTrendingWeek().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Популярно на этой неделе:";
        });
    } else if (target.closest("#top-rated-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getTopRatedTv().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Самые оцененные сериалы и шоу:";
        });
    } else if (target.closest("#popular-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getPopularTv().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Популярные сейчас сериалы и шоу:";
        });
    } else if (target.closest("#week-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getWeekTv().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Сериалы и шоу на этой неделе:";
        });
    } else if (target.closest("#today-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getTodayTv().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Сериалы и шоу на сегодня:";
        });
    } else if (target.closest("#top-rated-movie")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getTopRatedMovie().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Самые оцененные фильмы:";
        });
    } else if (target.closest("#popular-movie")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getPopularMovie().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Популярные сейчас фильмы:";
        });
    } else if (target.closest("#newest-movie")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getNowPlayingMovie().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Сейчас в кинотеатрах:";
        });
    } else if (target.closest("#now-playing-movie")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getNewestMovie().then(cardRendererUnit.renderCards).then(() => {
            outputTextInfo.textContent = "Фильмы, вышедшие недавно:";
        });
    }
});

// film card image changing
const changeImage = (event) => {
    const card = event.target.closest(".cards__item");
    if (card) {
        const image = card.querySelector(".card__img");
        if (image.dataset.backdrop) {
            [image.src, image.dataset.backdrop] = [image.dataset.backdrop, image.src];
        }
    }
};

cardsList.addEventListener("mouseover", changeImage);
cardsList.addEventListener("mouseout", changeImage);

// film card opening
cardsList.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest(".card");
    if (card) {
        card.append(loading);
        //tv card info rendering
        if (card.classList.contains("tv")) {
            dbServiceUnit.getTvCard(card.id)
                .then(response => {
                    cardImg.src = IMAGE_URL + response.poster_path;
                    cardImg.alt = response.name;
                    title.textContent = response.name;
                    genresList.textContent = "";
                    for (const item of response.genres) {
                        const genreName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
                        genresList.innerHTML += `<li>${genreName}</li>`;
                    }
                    const voteInfo = `${response.vote_average} (на основании ${response.vote_count} голосов)`;
                    rating.textContent = response.vote_average ? voteInfo : "Нет оценки";
                    description.textContent = response.overview;
                    modalLink.href = response.homepage;
                })
                .then(() => {
                    document.body.style.overflow = "hidden";
                    modal.classList.remove("hide");
                    loading.remove();
                });
        } else if (card.classList.contains("movie")) { // movie card rendering
            dbServiceUnit.getMovieCard(card.id)
                .then(response => {
                    cardImg.src = IMAGE_URL + response.poster_path;
                    cardImg.alt = response.title;
                    title.textContent = response.title;
                    genresList.textContent = "";
                    for (const item of response.genres) {
                        const genreName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
                        genresList.innerHTML += `<li>${genreName}</li>`;
                    }
                    const voteInfo = `${response.vote_average} (на основании ${response.vote_count} голосов)`;
                    rating.textContent = response.vote_average ? voteInfo : "Нет оценки";
                    description.textContent = response.overview;
                    modalLink.href = response.homepage;
                })
                .then(() => {
                    document.body.style.overflow = "hidden";
                    modal.classList.remove("hide");
                    loading.remove();
                });
        }
    }
});

// film card closing
modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest(".cross") || target.classList.contains("modal")) {
        document.body.style.overflow = "";
        modal.classList.add("hide");
    }
});

// shows more content if possible
paginator.addEventListener("click", (event) => {
    event.preventDefault();
    showLoading();
    dbServiceUnit.getNextPageFromResponses(nextPage).then(cardRendererUnit.renderCards);
});

// page position checker for upBtn activating
window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop >= clientHeight) {
        upBtn.style.visibility = "visible";
    } else {
        upBtn.style.visibility = "hidden";
    }
});

// move to top after page reloading
window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
});

// move to top of page
upBtn.addEventListener("click", () => {
    smoothToTop();
});

// to the start page
titleWrapper.addEventListener("click", (event) => {
    document.location.href = "http://miskri.github.io";
});
