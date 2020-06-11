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
    titleWrapper = document.querySelector(".title-wrapper");

// card elements
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
        dbServiceUnit.getSearchResults(value, undefined).then(cardRendererUnit.preRenderCards);
    }
});

fastSearchBtn.addEventListener("click", () => {
    searchForm.submit = true;
});


//========================================================
function loadDefault() {
    showLoading()
    dbServiceUnit.getTrendingDay().then(cardRendererUnit.preRenderCards).then(() => {
        outputTextInfo.textContent = "Популярно сегодня:";
    });
}

loadDefault();
//========================================================

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

    let tabId = target.id;
    const tabChild = target.closest(".span-text");
    if (tabChild) {
        tabId = tabChild.parentElement.id;
    }

    if (tabId) {
        showLoading();
        smoothToTop();
        switch (tabId) {
            case "trending-day":
                dbServiceUnit.getTrendingDay().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Популярно сегодня:";
                });
                break;

            case "trending-week":
                dbServiceUnit.getTrendingWeek().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Популярно на этой неделе:";
                });
                break;

            case "top-rated-tv":
                dbServiceUnit.getTopRatedTv().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Самые оцененные сериалы и шоу:";
                });
                break;

            case "popular-tv":
                dbServiceUnit.getPopularTv().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Популярные сейчас сериалы и шоу:";
                });
                break;

            case "week-tv":
                dbServiceUnit.getWeekTv().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Сериалы и шоу на этой неделе:";
                });
                break;

            case "today-tv":
                dbServiceUnit.getTodayTv().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Сериалы и шоу на сегодня:";
                });
                break;

            case "top-rated-movie":
                dbServiceUnit.getTopRatedMovie().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Самые оцененные фильмы:";
                });
                break;

            case "popular-movie":
                dbServiceUnit.getPopularMovie().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Популярные сейчас фильмы:";
                });
                break;

            case "newest-movie":
                dbServiceUnit.getNowPlayingMovie().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Сейчас в кинотеатрах:";
                });
                break;

            case "now-playing-movie":
                dbServiceUnit.getNewestMovie().then(cardRendererUnit.preRenderCards).then(() => {
                    outputTextInfo.textContent = "Фильмы, вышедшие недавно:";
                });
                break;

            default:
                break;
        }
    }

    if (target.closest("#home")) {
        document.location.href = "http://miskri.github.io";
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
        cardInfoRenderer(card);
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
    dbServiceUnit.getNextPageFromResponses(nextPage).then(cardRendererUnit.preRenderCards);
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
titleWrapper.addEventListener("click", () => {
    document.location.href = "http://miskri.github.io";
});
