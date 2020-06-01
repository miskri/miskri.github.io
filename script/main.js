const IMAGE_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const API_KEY = "5fa533a743045e934dc1d08cfe2d7520";
const SERVER_PATH = "https://api.themoviedb.org/3";

// main ui elements
const leftMenu = document.querySelector(".left-menu"),
    hamburger = document.querySelector(".hamburger"),
    tvShowsList = document.querySelector(".tv-shows__list"),
    modal = document.querySelector(".modal"),
    searchForm = document.querySelector(".search__form"),
    searchInput = document.querySelector(".search__form-input"),
    outputTextInfo = document.querySelector(".tv-shows__head"),
    paginator = document.querySelector(".pagination-btn"),
    upBtn = document.querySelector(".btn-up"),
    dropdowns = document.querySelectorAll(".dropdown");

// film card elements
const tvShows = document.querySelector(".tv-shows"),
    cardImg = document.querySelector(".tv-card__img"),
    title = document.querySelector(".modal__title"),
    genresList = document.querySelector(".genres-list"),
    rating = document.querySelector(".rating"),
    description = document.querySelector(".description"),
    modalLink = document.querySelector(".modal__link");

const preloader = document.querySelector(".preloader"); // TODO
const loading = document.createElement("div");
loading.className = "loading";

const clientHeight = document.documentElement.clientHeight;

const dbServiceUnit = new DBService();

let nextPage = 1;

function showLoading() {
    tvShowsList.append(loading);
}

function smoothToTop() {
    window.scrollTo({top: 0, behavior: "smooth"});
}

// card rendering from response
const renderCard = response => {
    if (response.page === 1) {
        tvShowsList.textContent = "";
    }

    if (response.total_results === 0) {
        outputTextInfo.textContent = "К сожалению, по вашему запросу ничего не обнаружено";
    } else {
        outputTextInfo.textContent = "Результаты поиска:";
        response.results.forEach(item => {
            const card = document.createElement("li");
            card.uniqId = item.id;
            card.classList.add("tv-shows__item");

            const {
                name: filmName,
                poster_path: poster,
                backdrop_path: backdrop,
                vote_average: vote
            } = item;

            const posterIMG = poster ? IMAGE_URL + poster : "img/no-poster.jpg";
            const backdropIMG = backdrop ? IMAGE_URL + backdrop : "img/no-poster.jpg";
            const voteValue = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

            card.innerHTML = `
        <a href="#" id="${card.uniqId}" class="tv-card">
            ${voteValue}
            <img class="tv-card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${filmName}">
            <h4 class="tv-card__head">${filmName}</h4> 
        </a>
        `;
            tvShowsList.append(card);
        });
    }
    if (response.page < response.total_pages) {
        paginator.style.visibility = "visible";
        nextPage = response.page + 1;
    } else {
        paginator.style.visibility = "hidden";
    }
    loading.remove();
};

// get search value, get response for API and then render card if response is correct
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = searchInput.value;
    searchInput.value = "";
    if (value) {
        showLoading()
        dbServiceUnit.getSearchResultTv(value).then(renderCard);
    }
});


//========================================================
{
    showLoading()
    dbServiceUnit.getPopularTv().then(renderCard).then(() => {
        outputTextInfo.textContent = "Популярные сейчас сериалы и шоу:";
    });
}
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

    if (target.closest("#top-rated-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getTopRatedTv().then(renderCard).then(() => {
            outputTextInfo.textContent = "Самые оцененные сериалы и шоу:";
        });
    } else if (target.closest("#popular-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getPopularTv().then(renderCard).then(() => {
            outputTextInfo.textContent = "Сериалы и шоу популярные сейчас:";
        });
    } else if (target.closest("#week-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getWeekTv().then(renderCard).then(() => {
            outputTextInfo.textContent = "Сериалы и шоу на этой неделе:";
        });
    } else if (target.closest("#today-tv")) {
        showLoading();
        smoothToTop();
        dbServiceUnit.getTodayTv().then(renderCard).then(() => {
            outputTextInfo.textContent = "Сериалы и шоу на сегодня:";
        });
    }
});

// film card image changing
const changeImage = (event) => {
    const card = event.target.closest(".tv-shows__item");
    if (card) {
        const image = card.querySelector(".tv-card__img");
        if (image.dataset.backdrop) {
            [image.src, image.dataset.backdrop] = [image.dataset.backdrop, image.src];
        }
    }
};

tvShowsList.addEventListener("mouseover", changeImage);
tvShowsList.addEventListener("mouseout", changeImage);

// film card opening
tvShowsList.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest(".tv-card");
    if (card) {
        card.append(loading);
        //film card info rendering
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
                rating.textContent = response.vote_average ? response.vote_average : "Нет оценки";
                description.textContent = response.overview;
                modalLink.href = response.homepage;
            })
            .then(() => {
                document.body.style.overflow = "hidden";
                modal.classList.remove("hide");
                loading.remove();
            });
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
    dbServiceUnit.getPageFromLastResponse(nextPage).then(renderCard);
});

// page position checker for upBtn activating
window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop >= clientHeight) {
        upBtn.style.visibility = "visible";
    } else {
        upBtn.style.visibility = "hidden";
    }
});

// move to top of page
upBtn.addEventListener("click", () => {
    smoothToTop();
});
