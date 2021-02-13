// main button that shows detailed search params
const detailedSearchBtn = document.querySelector(".btn-detailed-search"),
    // button container that shows/hides main button
    detailedSearchBtnContainer = document.querySelector(".btn-container"),
    // whole section that shows/hides all detailed search params
    detailedSearchBlock = document.querySelector(".detailed-search"),
    detailedSearchCancel = document.querySelector(".btn-detailed-search-cancel"),
    detailedSearchApply = document.querySelector(".btn-detailed-search-apply"),
    // param container with buttons that switch main search param (movie/tv)
    searchMainParam = document.querySelector(".main-params-container"),
    searchMainParamMovie = document.querySelector(".main-param-movie-btn"),
    searchMainParamTv = document.querySelector(".main-param-tv-btn"),
    // movie detailed search params
    movieParamBlock = document.querySelector(".detailed-search-movie-params"),
    // sort by category
    movieTypeSortBy = document.querySelector(".sort-by-type-container"),
    movieTypeSortByElements = document.querySelectorAll(".sort-by-type-btn"),
    // sort by param
    movieParamSortBy = document.querySelector(".sort-by-params-container"),
    movieParamElements = document.querySelectorAll(".sort-by-param-btn"),
    // genres list
    movieGenresShowMoreLess = document.querySelector(".sml-genres"),
    movieGenresBlock = document.querySelector(".genres-container"),
    movieGenresElements = document.querySelectorAll(".genre-btn"),
    movieToggleGenresBtn = document.querySelector(".genres-select-all"),
    movieToggleGenresBlock = document.querySelector(".genres-toggle-container"),
    // adult content
    movieAdultContent = document.querySelector(".adult-content"),
    // min/max vote count
    movieMixMaxVoteShowMoreLess = document.querySelector(".sml-vote-count"),
    movieMinMaxVoteCountBlock = document.querySelector(".vote-count-from-to-container"),
    movieMinMaxVoteCountBtn = document.querySelector(".vote-count-btn"),
    movieMinMaxVoteInputFrom = document.querySelector(".vote-count-from-input"),
    movieMinMaxVoteInputTo = document.querySelector(".vote-count-to-input"),
    // average vote
    movieAverageVoteShowMoreLess = document.querySelector(".sml-vote-average"),
    movieAverageVoteBlock = document.querySelector(".vote-average-container"),
    movieAverageVoteBtn = document.querySelector(".vote-average-btn"),
    movieAverageVoteInputFrom = document.querySelector(".vote-average-from-input"),
    movieAverageVoteInputTo = document.querySelector(".vote-average-to-input"),
    // runtime
    movieRuntimeShowMoreLess = document.querySelector(".sml-runtime"),
    movieRuntimeBlock = document.querySelector(".runtime-container"),
    movieRuntimeBtn = document.querySelector(".runtime-btn"),
    movieRuntimeHoursInputFrom = document.querySelector(".runtime-from-hours-input"),
    movieRuntimeMinutesInputFrom = document.querySelector(".runtime-from-minutes-input"),
    movieRuntimeHoursInputTo = document.querySelector(".runtime-to-hours-input"),
    movieRuntimeMinutesInputTo = document.querySelector(".runtime-to-minutes-input"),
    // tv detailed search message
    tvMessage = document.querySelector(".tv-message");

const movieGenresArr = [28, 12, 16, 35, 80, 99, 18, 14, 36, 27, 53, 37, 878, 9648, 10751, 10402, 10749, 10770, 10752];
const tvGenresArr = [];

let searchCategoryIsMovie = true;
let movieFilterParams = {
    category: "movie",
    sortBy: "",
    sortByType: "",
    withGenres: [],
    withoutGenres: movieGenresArr.slice(),
    adultContent: false,
    voteCountFilter: false,
    voteCountGte: -1,
    voteCountLte: -1,
    voteAverageFilter: false,
    voteAverageGte: -1,
    voteAverageLte: -1,
    runtimeFilter: false,
    runtimeHoursGte: -1,
    runtimeMinutesGte: -1,
    runtimeHoursLte: -1,
    runtimeMinutesLte: -1,
};
let tvFilterParams = {
    category: "tv",
};

// watch movieGenresArr.json
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

switchOffAllParams = () => {
    searchMainParamMovie.classList.add("param-inactive");
    searchMainParamTv.classList.add("param-inactive");
    movieParamBlock.style.display = "none";
    switchOffMovieParams();
    // TODO switchOffTvParams
    tvMessage.style.display = "none";
};

switchOffMovieParams = () => {
    toggleOffParams(movieTypeSortByElements);
    toggleOffParams(movieParamElements);
    toggleOffParams(movieGenresElements);

    movieGenresBlock.style.display = "none";
    movieToggleGenresBlock.style.display = "none";
    movieGenresShowMoreLess.textContent = "Show";

    movieMixMaxVoteShowMoreLess.textContent = "Show";
    movieMinMaxVoteCountBlock.style.display = "none";
    movieMinMaxVoteCountBtn.classList.add("param-inactive");
    movieMinMaxVoteInputFrom.value = "";
    movieMinMaxVoteInputTo.value = "";

    movieAverageVoteShowMoreLess.textContent = "Show";
    movieAverageVoteBlock.style.display = "none";
    movieAverageVoteBtn.classList.add("param-inactive");
    movieAverageVoteInputFrom.value = "";
    movieAverageVoteInputTo.value = "";

    movieRuntimeShowMoreLess.textContent = "Show";
    movieRuntimeBlock.style.display = "none";
    movieRuntimeBtn.classList.add("param-inactive");
    movieRuntimeHoursInputFrom.value = "";
    movieRuntimeMinutesInputFrom.value = "";
    movieRuntimeHoursInputTo.value = "";
    movieRuntimeMinutesInputTo.value = "";
};

resetMovieParamValues = () => {
    movieFilterParams = {
        category: "movie",
        sortBy: "",
        sortByType: "",
        withGenres: [],
        withoutGenres: movieGenresArr.slice(),
        adultContent: false,
        voteCountFilter: false,
        voteCountGte: -1,
        voteCountLte: -1,
        voteAverageFilter: false,
        voteAverageGte: -1,
        voteAverageLte: -1,
        runtimeFilter: false,
        runtimeHoursGte: -1,
        runtimeMinutesGte: -1,
        runtimeHoursLte: -1,
        runtimeMinutesLte: -1,
    };
};

toggleOffParams = (object) => {
    object.forEach(item => { item.classList.add("param-inactive");
    });
};

setMovieSearchParam = (target, param, value) => {
    if (movieFilterParams[param] !== value) {
        movieFilterParams[param] = value;
        target.classList.remove("param-inactive");
    } else {
        movieFilterParams[param] = "";
    }
};

// if sortBy is not selected sortByCategory is not selected too & default sortByCategory value is desc sorting
sortCategoryCheck = () => {
    if (movieFilterParams.sortBy !== "" && movieFilterParams.sortByType === "") {
        movieFilterParams.sortByType = ".desc";
        movieTypeSortByElements[0].classList.remove("param-inactive");
    } else if (movieFilterParams.sortBy === "" && movieFilterParams.sortByType !== "") {
        movieFilterParams.sortByType = "";
        movieTypeSortByElements[0].classList.add("param-inactive");
        movieTypeSortByElements[1].classList.add("param-inactive");
    }
};

genreListChanging = (target, id) => {
    target.classList.toggle("param-inactive");
    let withGenres = movieFilterParams.withGenres;
    let withoutGenres = movieFilterParams.withoutGenres;
    let toggleGenresBlock = movieToggleGenresBlock;
    if (withoutGenres.includes(id)) {
        withoutGenres.splice(withoutGenres.indexOf(id), 1);
        withGenres.push(id);
    } else {
        withGenres.splice(withGenres.indexOf(id), 1);
        withoutGenres.push(id);
    }

    // if selected genres count is zero button "remove all" is not visible
    if (withGenres.length > 0) {
        toggleGenresBlock.style.display = "inherit";
    } else {
        toggleGenresBlock.style.display = "none";
    }
};

// refresh value in input fields and reset values in filter param list
inputFieldCleaner = (btn, inputFieldFrom, inputFieldTo, filterParam, paramFrom, paramTo) => {
    if (!btn.classList.contains("param-inactive")) {
        btn.classList.add("param-inactive");
        inputFieldFrom.value = "";
        inputFieldTo.value = "";
        movieFilterParams[filterParam] = false;
        movieFilterParams[paramFrom] = -1;
        movieFilterParams[paramTo] = -1;
    }
}

// corrects the minimum and maximum possible values for the input fields & changes values in filter param list
inputFieldChanged = (btn, inputFieldFrom, inputFieldTo, filterParam, paramFrom, paramTo, paramName, paramValue) => {
    if (paramValue) {
        paramValue = parseFloat(paramValue);
        btn.classList.remove("param-inactive");
        movieFilterParams[filterParam] = true;
        movieFilterParams[paramName] = paramValue;
        // greater than equal means paramFrom, gte can't be greater than lte
        if (paramName === paramFrom && paramValue > movieFilterParams[paramTo]) {
            movieFilterParams[paramTo] = paramValue;
            inputFieldTo.value = `${paramValue}`;
        }
        // lower than equal
        else if (paramName === paramTo && paramValue < movieFilterParams[paramFrom]) {
            movieFilterParams[paramFrom] = paramValue;
            inputFieldFrom.value = `${paramValue}`;
        }
    } else {
        movieFilterParams[paramName] = -1;
        if (movieFilterParams[paramFrom] === -1 && movieFilterParams[paramTo] === -1) {
            btn.classList.add("param-inactive");
            movieFilterParams[filterParam] = false;
        }
    }
};

// special void for changed input field (for runtime param) // TODO rewrite?
inputFieldChangedSpecial = (btn, inputFieldFrom, inputFieldTo, filterParam, paramFrom, paramTo, paramName, paramValue) => {
    if (paramValue) {
        paramValue = parseFloat(paramValue);
        btn.classList.remove("param-inactive");
        movieFilterParams[filterParam] = true;
        movieFilterParams[paramName] = paramValue;
        // greater than equal means paramFrom, gte can't be greater than lte
        if (paramName === paramFrom && paramValue > movieFilterParams[paramTo]
            && movieFilterParams["runtimeHoursGte"] === movieFilterParams["runtimeHoursLte"]) {
            movieFilterParams[paramTo] = paramValue;
            inputFieldTo.value = `${paramValue}`;
        }
        // lower than equal
        else if (paramName === paramTo && paramValue < movieFilterParams[paramFrom]
            && movieFilterParams["runtimeHoursGte"] === movieFilterParams["runtimeHoursLte"]) {
            movieFilterParams[paramFrom] = paramValue;
            inputFieldFrom.value = `${paramValue}`;
        }
    } else {
        movieFilterParams[paramName] = -1;
        if (movieFilterParams[paramFrom] === -1 && movieFilterParams[paramTo] === -1) {
            btn.classList.add("param-inactive");
            movieFilterParams[filterParam] = false;
        }
    }
};

inputFieldHoursValueChangedFrom = () => {
    inputFieldChangedSpecial(movieRuntimeBtn, movieRuntimeMinutesInputFrom,
        movieRuntimeMinutesInputTo,
        "runtimeFilter", "runtimeMinutesGte", "runtimeMinutesLte", "runtimeMinutesGte",
        movieRuntimeMinutesInputFrom.value);
};

inputFieldHoursValueChangedTo = () => {
    inputFieldChangedSpecial(movieRuntimeBtn, movieRuntimeMinutesInputFrom,
        movieRuntimeMinutesInputTo,
        "runtimeFilter", "runtimeMinutesGte", "runtimeMinutesLte", "runtimeMinutesLte",
        movieRuntimeMinutesInputTo.value);
};

showMoreLess = (btn, block) => {
    if (btn.textContent === "Show") {
        block.style.display = "inherit";
        btn.textContent = "Hide";
    } else {
        block.style.display = "none";
        movieToggleGenresBlock.style.display = "none";
        btn.textContent = "Show";
    }
};

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
    resetMovieParamValues();
    // TODO resetTvParamValues
});

// select search category (movie/tv)
searchMainParam.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("#movieFilter")) {
        target.classList.remove("param-inactive");
        searchMainParamTv.classList.add("param-inactive");
        searchCategoryIsMovie = true;
        movieParamBlock.style.display = "inherit";
        // TODO switchOffTvParams
        tvMessage.style.display = "none";
    } else if (target.closest("#tvFilter")) {
        tvMessage.style.display = "inherit";
        target.classList.remove("param-inactive");
        searchMainParamMovie.classList.add("param-inactive");
        searchCategoryIsMovie = false;
        movieParamBlock.style.display = "none";
        switchOffMovieParams();
        resetMovieParamValues();
    }
});

movieTypeSortBy.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("#ascending")) {
        target.classList.remove("param-inactive");
        movieTypeSortByElements[0].classList.add("param-inactive");
        movieFilterParams.sortByType = ".asc";
        if (movieFilterParams.sortBy === "") {
            const originalTitle = movieParamElements[2];
            setMovieSearchParam(originalTitle, "sortBy", movieSortByValues["originalTitle"]);
        }
    } else if (target.closest("#descending")) {
        target.classList.remove("param-inactive");
        movieTypeSortByElements[1].classList.add("param-inactive");
        movieFilterParams.sortByType = ".desc";
        if (movieFilterParams.sortBy === "") {
            const popularity = movieParamElements[0];
            setMovieSearchParam(popularity, "sortBy", movieSortByValues["popularity"]);
        }
    }
});

// select sort type
movieParamSortBy.addEventListener("click", (event) => {
    const target = event.target;
    const sortBtn = target.closest(".sort-by-param-btn");
    if (sortBtn.id) {
        toggleOffParams(movieParamElements);
        setMovieSearchParam(target, "sortBy", movieSortByValues[sortBtn.id]);
        sortCategoryCheck();
    }
});

// show/hide genres list
movieGenresShowMoreLess.addEventListener("click", () => {
    let btn = movieGenresShowMoreLess;
    showMoreLess(btn, movieGenresBlock);
    if (movieFilterParams.withGenres.length > 0) {
        if (btn.textContent === "Hide") {
            movieToggleGenresBlock.style.display = "inherit";
        } else {
            movieToggleGenresBlock.style.display = "none";
        }
    }
});

// remove all genres from search list
movieToggleGenresBtn.addEventListener("click", () => {
    let withGenres = movieFilterParams.withGenres;
    let withoutGenres = movieFilterParams.withoutGenres;
    const withGenresLen = withGenres.length;
    movieGenresElements.forEach(item => {
        item.classList.add("param-inactive");
    });
    for (let i = 0; i < withGenresLen; i++) {
        withoutGenres.push(withGenres.pop());
    }
    movieToggleGenresBlock.style.display = "none";
});

movieGenresBlock.addEventListener("click", (event) => {
    const target = event.target;
    const genreBtn = target.closest(".genre-btn");
    if (genreBtn) {
        genreListChanging(target, movieGenresIds[genreBtn.id]);
    }
});

movieAdultContent.addEventListener("input", () => {
    movieFilterParams.adultContent = !movieFilterParams.adultContent;
});

// vote count filter
movieMixMaxVoteShowMoreLess.addEventListener("click", () => {
    showMoreLess(movieMixMaxVoteShowMoreLess, movieMinMaxVoteCountBlock);
});

movieMinMaxVoteCountBtn.addEventListener("click", () => {
    inputFieldCleaner(movieMinMaxVoteCountBtn, movieMinMaxVoteInputFrom,
        movieMinMaxVoteInputTo,
        "voteCountFilter", "voteCountGte", "voteCountLte");
});

movieMinMaxVoteInputFrom.addEventListener("change", () => {
    inputFieldChanged(movieMinMaxVoteCountBtn, movieMinMaxVoteInputFrom,
        movieMinMaxVoteInputTo,
        "voteCountFilter", "voteCountGte", "voteCountLte", "voteCountGte",
        movieMinMaxVoteInputFrom.value);
});

movieMinMaxVoteInputTo.addEventListener("change", () => {
    inputFieldChanged(movieMinMaxVoteCountBtn, movieMinMaxVoteInputFrom,
        movieMinMaxVoteInputTo,
        "voteCountFilter", "voteCountGte", "voteCountLte", "voteCountLte",
        movieMinMaxVoteInputTo.value);
});

// vote average filter
movieAverageVoteShowMoreLess.addEventListener("click", () => {
    showMoreLess(movieAverageVoteShowMoreLess, movieAverageVoteBlock);
});

movieAverageVoteBtn.addEventListener("click", () => {
    inputFieldCleaner(movieAverageVoteBtn, movieAverageVoteInputFrom,
        movieAverageVoteInputTo,
        "voteAverageFilter", "voteAverageGte", "voteAverageLte");
});

movieAverageVoteInputFrom.addEventListener("change", () => {
    inputFieldChanged(movieAverageVoteBtn, movieAverageVoteInputFrom,
        movieAverageVoteInputTo,
        "voteAverageFilter", "voteAverageGte", "voteAverageLte", "voteAverageGte",
        movieAverageVoteInputFrom.value);
});

movieAverageVoteInputTo.addEventListener("change", () => {
    inputFieldChanged(movieAverageVoteBtn, movieAverageVoteInputFrom,
        movieAverageVoteInputTo,
        "voteAverageFilter", "voteAverageGte", "voteAverageLte", "voteAverageLte",
        movieAverageVoteInputTo.value);
});

// runtime filter TODO fix
movieRuntimeShowMoreLess.addEventListener("click", () => {
    showMoreLess(movieRuntimeShowMoreLess, movieRuntimeBlock);
});

movieRuntimeBtn.addEventListener("click", () => {
    inputFieldCleaner(movieRuntimeBtn, movieRuntimeHoursInputFrom,
        movieRuntimeHoursInputTo,
        "runtimeFilter", "runtimeHoursGte", "runtimeHoursLte");
    movieRuntimeBtn.classList.remove("param-inactive");
    inputFieldCleaner(movieRuntimeBtn, movieRuntimeMinutesInputFrom,
        movieRuntimeMinutesInputTo,
        "runtimeFilter", "runtimeMinutesGte", "runtimeMinutesLte");
});

movieRuntimeHoursInputFrom.addEventListener("change", () => {
    inputFieldChanged(movieRuntimeBtn, movieRuntimeHoursInputFrom,
        movieRuntimeHoursInputTo,
        "runtimeFilter", "runtimeHoursGte", "runtimeHoursLte", "runtimeHoursGte",
        movieRuntimeHoursInputFrom.value);
    inputFieldHoursValueChangedFrom();
});

movieRuntimeHoursInputTo.addEventListener("change", () => {
    inputFieldChanged(movieRuntimeBtn, movieRuntimeHoursInputFrom,
        movieRuntimeHoursInputTo,
        "runtimeFilter", "runtimeHoursGte", "runtimeHoursLte", "runtimeHoursLte",
        movieRuntimeHoursInputTo.value);
    inputFieldHoursValueChangedTo();
});

movieRuntimeMinutesInputFrom.addEventListener("change", () => {
    inputFieldHoursValueChangedFrom();
});

movieRuntimeMinutesInputTo.addEventListener("change", () => {
    inputFieldHoursValueChangedTo();
});

// apply search params
detailedSearchApply.addEventListener("click", () => {
    if (searchCategoryIsMovie) {
        showLoading();
        outputTextInfo.textContent = "Detailed search result:";
        dbServiceUnit.getDetailedSearchResultsMovie(dbServiceUnit.createDetailedResponse(movieFilterParams))
            .then(cardRendererUnit.preRenderCards);
    }
});
