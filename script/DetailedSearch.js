// main button that shows detailed search params
const detailedSearchBtn = document.querySelector(".btn-detailed-search"),
    // button container that shows/hides main button
    detailedSearchBtnContainer = document.querySelector(".btn-container"),
    // whole section that shows/hides all detailed search params
    detailedSearchBlock = document.querySelector(".detailed-search"),
    detailedSearchCancel = document.querySelector(".btn-detailed-search-cancel"),
    detailedSearchApply = document.querySelector(".btn-detailed-search-apply"),
    // param container with buttons that switch main search param (movie/tv)
    detailedSearchMainParam = document.querySelector(".main-params-container"),
    detailedSearchMainParamMovie = document.querySelector(".main-param-movie-btn"),
    detailedSearchMainParamTv = document.querySelector(".main-param-tv-btn"),
    // movie detailed search params
    detailedSearchMovieParamBlock = document.querySelector(".detailed-search-movie-params"),
    // sort by category
    detailedSearchMovieTypeSortBy = document.querySelector(".sort-by-type-container"),
    detailedSearchMovieTypeSortByElements = document.querySelectorAll(".sort-by-type-btn"),
    // sort by param
    detailedSearchMovieParamSortBy = document.querySelector(".sort-by-params-container"),
    detailedSearchMovieParamElements = document.querySelectorAll(".sort-by-param-btn"),
    // genres list
    detailedSearchMovieGenresBlock = document.querySelector(".genres-container"),
    detailedSearchMovieGenresElements = document.querySelectorAll(".genre-btn"),
    detailedSearchMovieToggleGenresBtn = document.querySelector(".genres-select-all");

let searchCategoryIsMovie = true;
let movieFilterParams = {
    category: "movie",
    sortBy: "",
    sortByType: "",
    withGenres: [],
    withoutGenres: [28, 12, 16, 35, 80, 99, 18, 14, 36, 27, 53, 37, 878, 9648, 10751, 10402, 10749, 10770, 10752],
};
let tvFilterParams = {
    category: "tv",
};


// watch movieGenres.json
const movieGenresIds = {
    "action": 28,
    "adventure": 12,
    "animation": 16,
    "comedy": 35,
    "crime": 80,
    "documentary": 99,
    "drama": 18,
    "family": 10751,
    "fantasy": 14,
    "history": 36,
    "horror": 27,
    "music": 10402,
    "mystery": 9648,
    "romance": 10749,
    "science-fiction": 878,
    "tv-movie": 10770,
    "thriller": 53,
    "war": 10752,
    "western": 37
};

const movieSortByValues = {
    "popularity": "popularity",
    "releaseDate": "primary_release_date",
    "originalTitle": "original_title",
    "voteAverage": "vote_average",
    "voteCount": "vote_count"
};

function switchOffAllParams() {
    detailedSearchMainParamMovie.classList.add("param-inactive");
    detailedSearchMainParamTv.classList.add("param-inactive");
    detailedSearchMovieParamBlock.style.display = "none";
    switchOffMovieParams();
    // TODO switchOffTvParams
}

function switchOffMovieParams() {
    toggleOffParams(detailedSearchMovieTypeSortByElements);
    toggleOffParams(detailedSearchMovieParamElements);
    toggleOffParams(detailedSearchMovieGenresElements);
    detailedSearchMovieToggleGenresBtn.classList.add("param-inactive");
}

function toggleOffParams(object) {
    object.forEach(item => {
        item.classList.add("param-inactive");
    });
}

function setMovieSearchParam(target, param, value) {
    if (movieFilterParams[param] !== value) {
        movieFilterParams[param] = value;
        target.classList.remove("param-inactive");
    } else {
        movieFilterParams[param] = "";
    }
}

// if sortBy is not selected sortByCategory is not selected too & default sortByCategory value is desc sorting
function sortCategoryCheck() {
    if (movieFilterParams.sortBy !== "" && movieFilterParams.sortByType === "") {
        movieFilterParams.sortByType = ".desc";
        detailedSearchMovieTypeSortByElements[0].classList.remove("param-inactive");
    } else if (movieFilterParams.sortBy === "" && movieFilterParams.sortByType !== "") {
        movieFilterParams.sortByType = "";
        detailedSearchMovieTypeSortByElements[0].classList.add("param-inactive");
        detailedSearchMovieTypeSortByElements[1].classList.add("param-inactive");
    }
}

function genreListChanging(target, id) {
    target.classList.toggle("param-inactive");
    let withGenres = movieFilterParams.withGenres;
    let withoutGenres = movieFilterParams.withoutGenres;
    let genreSwitchBtn = detailedSearchMovieToggleGenresBtn;
    if (withoutGenres.includes(id)) {
        withoutGenres.splice(withoutGenres.indexOf(id), 1);
        withGenres.push(id);
    } else {
        withGenres.splice(withGenres.indexOf(id), 1);
        withoutGenres.push(id);
    }

    // if selected genres count is zero button "remove all" is not active
    if (withGenres.length > 0) {
        genreSwitchBtn.classList.remove("param-inactive");
    } else {
        genreSwitchBtn.classList.add("param-inactive");
    }
}

// show detailed search params on click
detailedSearchBtn.addEventListener("click", () => {
    detailedSearchBlock.style.display = "inherit";
    detailedSearchBtnContainer.style.display = "none";
});

// hide detailed search
detailedSearchCancel.addEventListener("click", () => {
    detailedSearchBlock.style.display = "none";
    detailedSearchBtnContainer.style.display = "flex";
    switchOffAllParams();
});

// select search category (movie/tv)
detailedSearchMainParam.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("#movieFilter")) {
        target.classList.remove("param-inactive");
        detailedSearchMainParamTv.classList.add("param-inactive");
        searchCategoryIsMovie = true;
        detailedSearchMovieParamBlock.style.display = "inherit";
        // TODO switchOffTvParams
    } else if (target.closest("#tvFilter")) {
        target.classList.remove("param-inactive");
        detailedSearchMainParamMovie.classList.add("param-inactive");
        searchCategoryIsMovie = false;
        detailedSearchMovieParamBlock.style.display = "none";
        switchOffMovieParams();
    }
});


detailedSearchMovieTypeSortBy.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("#ascending")) {
        target.classList.remove("param-inactive");
        detailedSearchMovieTypeSortByElements[0].classList.add("param-inactive");
        movieFilterParams.sortByType = ".asc";
        if (movieFilterParams.sortBy === "") {
            const originalTitle = detailedSearchMovieParamElements[2];
            setMovieSearchParam(originalTitle, "sortBy", movieSortByValues["originalTitle"]);
        }
    } else if (target.closest("#descending")) {
        target.classList.remove("param-inactive");
        detailedSearchMovieTypeSortByElements[1].classList.add("param-inactive");
        movieFilterParams.sortByType = ".desc";
        if (movieFilterParams.sortBy === "") {
            const popularity = detailedSearchMovieParamElements[0];
            setMovieSearchParam(popularity, "sortBy", movieSortByValues["popularity"]);
        }
    }
});

// select sort type
detailedSearchMovieParamSortBy.addEventListener("click", (event) => {
    const target = event.target;
    const sortBtn = target.closest(".sort-by-param-btn");
    if (sortBtn.id) {
        toggleOffParams(detailedSearchMovieParamElements);
        setMovieSearchParam(target, "sortBy", movieSortByValues[sortBtn.id]);
        sortCategoryCheck();
    }
});

// remove all genres from search list
detailedSearchMovieToggleGenresBtn.addEventListener("click", () => {
    let withGenres = movieFilterParams.withGenres;
    let withoutGenres = movieFilterParams.withoutGenres;
    let btn = detailedSearchMovieToggleGenresBtn;
    const withGenresLen = withGenres.length;
    if (!btn.classList.contains("param-inactive")) {
        detailedSearchMovieGenresElements.forEach(item => {
            item.classList.add("param-inactive");
        });
        for (let i = 0; i < withGenresLen; i++) {
            withoutGenres.push(withGenres.pop());
        }
        btn.classList.add("param-inactive");
    }
});

detailedSearchMovieGenresBlock.addEventListener("click", (event) => {
    const target = event.target;
    const genreBtn = target.closest(".genre-btn");
    if (genreBtn.id) {
        genreListChanging(target, movieGenresIds[genreBtn.id]);
    }
});

// apply search params
detailedSearchApply.addEventListener("click", () => {
    if (searchCategoryIsMovie) {
        showLoading();
        outputTextInfo.textContent = "Результаты точного поиска:";
        dbServiceUnit.getDetailedSearchResultsMovie(dbServiceUnit.createDetailedResponse(movieFilterParams))
            .then(cardRendererUnit.preRenderCards);
    }
});