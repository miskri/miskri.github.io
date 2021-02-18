const IMAGE_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const API_KEY = "5fa533a743045e934dc1d08cfe2d7520";
const SERVER_PATH = "https://api.themoviedb.org/3"; // main ui elements

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
    titleWrapper = document.querySelector(".title-wrapper"); // card elements

const cardImg = document.querySelector(".card__img"),
    title = document.querySelector(".modal__title"),
    genresList = document.querySelector(".genres-list"),
    prodCountriesList = document.querySelector(".prod-countries-list"),
    rating = document.querySelector(".rating"),
    releaseYear = document.querySelector(".release-date"),
    description = document.querySelector(".description"),
    modalLink = document.querySelector(".modal__link");
const loading = document.createElement("div");
loading.className = "loading";
const clientHeight = document.documentElement.clientHeight;
const cardRendererUnit = new CardRenderer();
const dbServiceUnit = new DBService();
let nextPage = 1;

showLoading = function () {
    cardsList.append(loading);
};

smoothToTop = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}; // get search value, get response for API and then render card if response is correct

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = searchInput.value;
    searchInput.value = "";

    if (value) {
        showLoading();
        outputTextInfo.textContent = "Searching results:";
        dbServiceUnit
            .getSearchResults(value, undefined)
            .then(cardRendererUnit.preRenderCards);
    }
});
fastSearchBtn.addEventListener("click", function () {
    searchForm.submit = true;
}); //========================================================

loadDefault = function () {
    showLoading();
    dbServiceUnit
        .getTrendingDay()
        .then(cardRendererUnit.preRenderCards)
        .then(function () {
            outputTextInfo.textContent = "Popular today:";
        });
};

loadDefault(); //========================================================
// left bar opening

hamburger.addEventListener("click", function () {
    leftMenu.classList.toggle("openMenu");
    hamburger.classList.toggle("open");
}); // left bar closing

document.addEventListener("click", function (event) {
    const target = event.target;

    if (!target.closest(".left-menu")) {
        leftMenu.classList.remove("openMenu");
        hamburger.classList.remove("open");
        dropdowns.forEach(function (item) {
            item.classList.remove("active");
        });
    }
}); // dropdown in left bar opening & top/popular search

leftMenu.addEventListener("click", function (event) {
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
    if (tabChild) tabId = tabChild.parentElement.id;

    if (tabId) {
        showLoading();
        smoothToTop();

        switch (tabId) {
            case "trending-day":
                dbServiceUnit
                    .getTrendingDay()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Popular today:";
                    });
                break;

            case "trending-week":
                dbServiceUnit
                    .getTrendingWeek()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Popular this week:";
                    });
                break;

            case "top-rated-tv":
                dbServiceUnit
                    .getTopRatedTv()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Most rated TV series and shows:";
                    });
                break;

            case "popular-tv":
                dbServiceUnit
                    .getPopularTv()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Popular TV series and shows:";
                    });
                break;

            case "week-tv":
                dbServiceUnit
                    .getWeekTv()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "TV series and shows this week:";
                    });
                break;

            case "today-tv":
                dbServiceUnit
                    .getTodayTv()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "TV series and shows for today:";
                    });
                break;

            case "top-rated-movie":
                dbServiceUnit
                    .getTopRatedMovie()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Most rated films:";
                    });
                break;

            case "popular-movie":
                dbServiceUnit
                    .getPopularMovie()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Popular films now:";
                    });
                break;

            case "newest-movie":
                dbServiceUnit
                    .getNowPlayingMovie()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Now in cinemas:";
                    });
                break;

            case "now-playing-movie":
                dbServiceUnit
                    .getNewestMovie()
                    .then(cardRendererUnit.preRenderCards)
                    .then(function () {
                        outputTextInfo.textContent = "Recently released films:";
                    });
                break;

            default:
                break;
        }
    }

    if (target.closest("#home"))
        document.location.href = "http://miskri.github.io";
}); // film card image changing

const changeImage = function (event) {
    const card = event.target.closest(".cards__item");

    if (card) {
        const image = card.querySelector(".card__img");
        if (image.dataset.backdrop)
            [image.src, image.dataset.backdrop] = [image.dataset.backdrop, image.src];
    }
};

cardsList.addEventListener("mouseover", changeImage);
cardsList.addEventListener("mouseout", changeImage); // film card opening

cardsList.addEventListener("click", function (event) {
    event.preventDefault();
    const target = event.target;
    const card = target.closest(".card");

    if (card) {
        card.append(loading);
        cardInfoRenderer(card);
    }
}); // film card closing

modal.addEventListener("click", function (event) {
    const target = event.target;

    if (target.closest(".cross") || target.classList.contains("modal")) {
        document.body.style.overflow = "";
        modal.classList.add("hide");
    }
}); // shows more content if possible

paginator.addEventListener("click", function (event) {
    event.preventDefault();
    showLoading();
    dbServiceUnit
        .getNextPageFromResponses(nextPage)
        .then(cardRendererUnit.preRenderCards);
}); // page position checker for upBtn activating

window.addEventListener("scroll", function () {
    if (document.documentElement.scrollTop >= clientHeight)
        upBtn.style.visibility = "visible";
    else upBtn.style.visibility = "hidden";
}); // move to top after page reloading

window.addEventListener("beforeunload", function () {
    window.scrollTo(0, 0);
}); // move to top of page

upBtn.addEventListener("click", function () {
    smoothToTop();
}); // to the start page

titleWrapper.addEventListener("click", function () {
    document.location.href = "http://miskri.github.io";
});
