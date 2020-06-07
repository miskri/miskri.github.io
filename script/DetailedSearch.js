// main button that shows detailed search params
const detailedSearchBtn = document.querySelector(".btn-detailed-search"),
    // button container that shows/hides main button
    detailedSearchBtnContainer = document.querySelector(".btn-container"),
    // whole section that shows/hides all detailed search params
    detailedSearchBlock = document.querySelector(".detailed-search"),
    detailedSearchCancel = document.querySelector(".btn-detailed-search-cancel"),
    detailedSearchApply = document.querySelector(".btn-detailed-search-apply"),
    // param container with buttons that switch main search param (movie/tv)
    detailedSearchMainParamContainer = document.querySelector(".main-params-container"),
    detailedSearchMainParamMovie = document.querySelectorAll(".main-param-btn")[0],
    detailedSearchMainParamTv = document.querySelectorAll(".main-param-btn")[1],
    // movie detailed search params
    detailedSearchMovieParamBlock = document.querySelector(".detailed-search-movie-params"),
    // sort by param
    detailedSearchMovieParamSortBy = document.querySelector(".sort-by-params-container"),
    detailedSearchMovieParamElements = document.querySelectorAll(".sort-by-param-btn");
//

let searchCategoryIsMovie = true;
let movieFilterParams = {
    category: "movie",
    sortBy: "",
    sortByType: ".desc",
};
let tvFilterParams = {
    category: "tv",
};

// show detailed search params on click
detailedSearchBtn.addEventListener("click", (event) => {
    detailedSearchBlock.style.display = "inherit";
    detailedSearchBtnContainer.style.display = "none";
});

// hide detailed search
detailedSearchCancel.addEventListener("click", (event) => {
    detailedSearchBlock.style.display = "none";
    detailedSearchBtnContainer.style.display = "flex";

    // TODO func
    detailedSearchMainParamMovie.classList.add("param-inactive");
    detailedSearchMainParamTv.classList.add("param-inactive");
    detailedSearchMovieParamBlock.style.display = "none";
    toggleOffParams(detailedSearchMovieParamElements);
});

// select search category (movie/tv)
detailedSearchMainParamContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("#movieFilter")) {
        target.classList.remove("param-inactive");
        detailedSearchMainParamTv.classList.add("param-inactive");
        searchCategoryIsMovie = true;
        detailedSearchMovieParamBlock.style.display = "inherit";
    } else if (target.closest("#tvFilter")) {
        target.classList.remove("param-inactive");
        detailedSearchMainParamMovie.classList.add("param-inactive");
        searchCategoryIsMovie = false;
        detailedSearchMovieParamBlock.style.display = "none";
        toggleOffParams(detailedSearchMovieParamElements);
    }
});


function toggleOffParams(object) {
    object.forEach(item => {
        item.classList.add("param-inactive");
    });
}

// select sort type
detailedSearchMovieParamSortBy.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest(".sort-by-param-btn")) {
        toggleOffParams(detailedSearchMovieParamElements);
        if (target.closest("#popularity")) {
            if (movieFilterParams.sortBy !== "popularity") {
                movieFilterParams.sortBy = "popularity";
                target.classList.remove("param-inactive");
            } else {
                movieFilterParams.sortBy = "";
            }
        } else if (target.closest("#releaseDate")) {
            if (movieFilterParams.sortBy !== "release_date") {
                movieFilterParams.sortBy = "release_date";
                target.classList.remove("param-inactive");
            } else {
                movieFilterParams.sortBy = "";
            }
        } else if (target.closest("#originalTitle")) {
            if (movieFilterParams.sortBy !== "original_title") {
                movieFilterParams.sortBy = "original_title";
                target.classList.remove("param-inactive");
            } else {
                movieFilterParams.sortBy = "";
            }
        } else if (target.closest("#voteAverage")) {
            if (movieFilterParams.sortBy !== "vote_average") {
                movieFilterParams.sortBy = "vote_average";
                target.classList.remove("param-inactive");
            } else {
                movieFilterParams.sortBy = "";
            }
        } else if (target.closest("#voteCount")) {
            if (movieFilterParams.sortBy !== "vote_count") {
                movieFilterParams.sortBy = "vote_count";
                target.classList.remove("param-inactive");
            } else {
                movieFilterParams.sortBy = "";
            }
        }
    }
});

// apply search params
detailedSearchApply.addEventListener("click", (event) => {
    if (searchCategoryIsMovie) {
        showLoading();
        outputTextInfo.textContent = "Результаты точного поиска:";
        dbServiceUnit.getDetailedSearchResultsMovie(dbServiceUnit.createDetailedResponse(movieFilterParams))
            .then(cardRendererUnit.renderCards);
    }
});